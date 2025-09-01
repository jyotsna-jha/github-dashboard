// FIXED: formatData.js with proper real-time updates

export function formatWeeklyCommits(events) {
  const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const commitCount = Array(7).fill(0);

  if (!events || !Array.isArray(events)) {
    console.warn("No events provided to formatWeeklyCommits");
    return week.map((day, i) => ({ name: day, commits: commitCount[i] }));
  }

  // ✅ FIX: Use proper date comparison
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  oneWeekAgo.setHours(0, 0, 0, 0); // Start of day

  console.log("📅 Filtering events from:", oneWeekAgo.toISOString());
  
  const weeklyEvents = events.filter((event) => {
    if (event.type === "PushEvent") {
      const eventDate = new Date(event.created_at);
      const isInWeek = eventDate >= oneWeekAgo; // ✅ FIX: Proper comparison
      
      if (isInWeek) {
        console.log("📦 Including event:", {
          date: eventDate.toLocaleString(),
          repo: event.repo?.name,
          commits: event.payload?.size || 1
        });
      }
      
      return isInWeek;
    }
    return false;
  });

  console.log(`📊 Found ${weeklyEvents.length} push events in last 7 days`);

  weeklyEvents.forEach((event) => {
    const date = new Date(event.created_at);
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    const commitSize = event.payload?.size || 1;
    commitCount[day] += commitSize;
    
    console.log(`➕ Adding ${commitSize} commits to ${week[day]} (${date.toLocaleDateString()})`);
  });

  const result = week.map((day, i) => ({
    name: day,
    commits: commitCount[i],
  }));
  
  console.log("📈 Weekly commits result:", result);
  return result;
}

export function getCurrentStreak(events) {
  if (!events || !Array.isArray(events)) return 0;
  
  // ✅ FIX: Start from today and work backwards
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  
  let streak = 0;
  let currentDate = new Date(today);
  
  console.log("🔥 Calculating streak starting from:", currentDate.toDateString());
  
  // Check last 100 days maximum
  for (let i = 0; i < 100; i++) {
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    const dayEvents = events.filter((event) => {
      if (event.type !== "PushEvent") return false;
      const eventDate = new Date(event.created_at);
      return eventDate >= dayStart && eventDate <= dayEnd;
    });

    if (dayEvents.length > 0) {
      streak++;
      console.log(`✅ Found ${dayEvents.length} commits on ${currentDate.toDateString()}`);
    } else {
      console.log(`❌ No commits on ${currentDate.toDateString()}, streak ends`);
      break;
    }
    
    // Move to previous day
    currentDate.setDate(currentDate.getDate() - 1);
  }

  console.log(`🏆 Final streak: ${streak} days`);
  return streak;
}

export function getRecentActivity(events, limit = 5) {
  if (!events || !Array.isArray(events)) return [];
  
  return events
    .filter((event) => 
      ["PushEvent", "IssuesEvent", "PullRequestEvent", "CreateEvent"].includes(event.type)
    )
    .slice(0, limit)
    .map((event) => {
      const repo = event.repo?.name?.split('/')[1] || event.repo?.name || 'Unknown';
      const type = event.type.replace("Event", "");
      const createdAt = new Date(event.created_at);
      
      // ✅ FIX: Better time formatting
      const timeAgo = getTimeAgo(createdAt);
      
      return { 
        type, 
        repo, 
        createdAt: createdAt.toLocaleDateString(),
        timeAgo,
        fullDate: createdAt.toLocaleString()
      };
    });
}

// ✅ NEW: Helper function for better time display
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function calculateActivityStats(events) {
  if (!events || !Array.isArray(events)) {
    console.warn("No events provided to calculateActivityStats");
    return {
      totalCommitsThisWeek: 0,
      totalCommitsThisMonth: 0,
      uniqueReposThisWeek: 0,
      totalEventsThisWeek: 0,
      avgCommitsPerDay: 0,
      mostActiveRepo: null
    };
  }
  
  // ✅ FIX: Proper date boundaries
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  console.log("📊 Calculating stats from:", oneWeekAgo.toISOString(), "to:", now.toISOString());
  
  const weeklyEvents = events.filter(event => {
    const eventDate = new Date(event.created_at);
    return eventDate >= oneWeekAgo && eventDate <= now;
  });
  
  const monthlyEvents = events.filter(event => {
    const eventDate = new Date(event.created_at);
    return eventDate >= oneMonthAgo && eventDate <= now;
  });
  
  console.log(`📈 Weekly events: ${weeklyEvents.length}, Monthly events: ${monthlyEvents.length}`);
  
  // Calculate total commits with better logging
  const weeklyPushEvents = weeklyEvents.filter(event => event.type === 'PushEvent');
  const monthlyPushEvents = monthlyEvents.filter(event => event.type === 'PushEvent');
  
  const totalCommitsThisWeek = weeklyPushEvents.reduce((sum, event) => {
    const commits = event.payload?.size || 1;
    console.log(`📦 Push event: ${commits} commits to ${event.repo?.name} at ${new Date(event.created_at).toLocaleString()}`);
    return sum + commits;
  }, 0);
    
  const totalCommitsThisMonth = monthlyPushEvents.reduce((sum, event) => 
    sum + (event.payload?.size || 1), 0);
  
  // Calculate unique repositories
  const uniqueReposThisWeek = new Set(
    weeklyEvents.map(event => event.repo?.name).filter(Boolean)
  ).size;
  
  // Find most active repository
  const repoActivity = {};
  weeklyPushEvents.forEach(event => {
    if (event.repo?.name) {
      const repoName = event.repo.name.split('/')[1] || event.repo.name;
      const commits = event.payload?.size || 1;
      repoActivity[repoName] = (repoActivity[repoName] || 0) + commits;
    }
  });
  
  const mostActiveRepo = Object.entries(repoActivity).length > 0 
    ? Object.entries(repoActivity).reduce((a, b) => a[1] > b[1] ? a : b)
    : null;
  
  const stats = {
    totalCommitsThisWeek,
    totalCommitsThisMonth,
    uniqueReposThisWeek,
    totalEventsThisWeek: weeklyEvents.length,
    avgCommitsPerDay: totalCommitsThisWeek > 0 ? (totalCommitsThisWeek / 7).toFixed(1) : 0,
    mostActiveRepo: mostActiveRepo ? {
      name: mostActiveRepo[0],
      commits: mostActiveRepo[1]
    } : null
  };
  
  console.log("📊 Final activity stats:", stats);
  return stats;
}

export function calculateRepoStats(repos) {
  if (!repos || !Array.isArray(repos)) {
    console.warn("No repos provided to calculateRepoStats");
    return {
      totalRepos: 0,
      totalStars: 0,
      totalForks: 0,
      languagesUsed: 0,
      forkedRepos: 0,
      originalRepos: 0,
      privateRepos: 0
    };
  }
  
  const languages = new Set(repos.map(repo => repo.language).filter(Boolean));
  
  const stats = {
    totalRepos: repos.length,
    totalStars: repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
    totalForks: repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
    languagesUsed: languages.size,
    forkedRepos: repos.filter(repo => repo.fork).length,
    originalRepos: repos.filter(repo => !repo.fork).length,
    privateRepos: repos.filter(repo => repo.private).length
  };
  
  console.log("📁 Repo stats:", stats);
  return stats;
}

export function getContributionData(events) {
  if (!events || !Array.isArray(events)) return [];
  
  const weeks = 12;
  const contributionMap = new Map();
  
  // ✅ FIX: Process events and create proper date keys
  events.forEach(event => {
    if (event.type === 'PushEvent') {
      const date = new Date(event.created_at);
      // Use ISO date string for consistency
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      const commits = event.payload?.size || 1;
      contributionMap.set(dateKey, (contributionMap.get(dateKey) || 0) + commits);
    }
  });
  
  // ✅ FIX: Generate contribution grid properly
  const contributions = [];
  const today = new Date();
  
  for (let week = 0; week < weeks; week++) {
    const weekData = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      // ✅ FIX: Calculate date correctly (start from today, go back)
      date.setDate(date.getDate() - ((weeks - 1 - week) * 7) - (6 - day));
      const dateKey = date.toISOString().split('T')[0];
      weekData.push(contributionMap.get(dateKey) || 0);
    }
    contributions.push(weekData);
  }
  
  console.log("🗓️ Contribution data generated:", contributions);
  return contributions;
}