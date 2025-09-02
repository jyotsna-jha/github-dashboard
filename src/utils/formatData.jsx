// src/utils/formatData.js

/**
 * Format weekly commits for the bar chart
 * @param {Array} events - GitHub events
 * @returns {Array} - Array of { name: 'Mon', commits: 5 }
 */
export function formatWeeklyCommits(events) {
  const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const commitCount = Array(7).fill(0);

  if (!events || !Array.isArray(events)) {
    return week.map((day, i) => ({ name: day, commits: commitCount[i] }));
  }

  // Get current date in UTC to avoid timezone issues
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  
  // Calculate the start of the week (Sunday) in UTC
  const startOfWeek = new Date(today);
  startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay());
  startOfWeek.setUTCHours(0, 0, 0, 0);

  events.forEach((event) => {
    if (event.type === "PushEvent") {
      const eventDate = new Date(event.created_at);
      // Convert to UTC date for comparison
      const eventUTCDate = new Date(Date.UTC(
        eventDate.getUTCFullYear(), 
        eventDate.getUTCMonth(), 
        eventDate.getUTCDate()
      ));
      
      // Check if the event is within the current week
      if (eventUTCDate >= startOfWeek && eventUTCDate <= today) {
        const dayIndex = eventUTCDate.getUTCDay();
        const commitSize = event.payload?.size || 1;
        commitCount[dayIndex] += commitSize;

        console.log(`✅ Commit on ${week[dayIndex]}: ${commitSize} commit(s)`);
      }
    }
  });

  return week.map((day, i) => ({
    name: day,
    commits: commitCount[i],
  }));
}

/**
 * Calculate current coding streak (consecutive days with at least one PushEvent)
 * @param {Array} events - GitHub events
 * @returns {number} - Streak in days
 */
/**
 * Calculate current coding streak (consecutive days with at least one PushEvent)
 * @param {Array} events - GitHub events
 * @returns {number} - Streak in days
 */
/**
 * Calculate current coding streak (consecutive days with at least one PushEvent)
 * @param {Array} events - GitHub events
 * @returns {number} - Streak in days
 */
export function getCurrentStreak(events) {
  if (!events || !Array.isArray(events)) return 0;

  // Normalize a date to UTC 00:00:00 (start of day)
  function getUTCDateOnly(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  const now = new Date();
  let currentDate = getUTCDateOnly(now); // Today at 00:00 UTC

  // 🔁 Start from yesterday if today has no commit
  const todayHasCommit = events.some((event) => {
    if (event.type !== "PushEvent") return false;
    const eventDate = new Date(event.created_at);
    const eventUTC = getUTCDateOnly(eventDate);
    return eventUTC.getTime() === currentDate.getTime();
  });

  // 📅 Start checking from yesterday if today has no commit
  if (!todayHasCommit) {
    console.log("🟡 No commit today. Starting streak from yesterday.");
    currentDate = new Date(currentDate);
    currentDate.setUTCDate(currentDate.getUTCDate() - 1); // Move to yesterday
  } else {
    console.log("✅ Commit today. Including today in streak.");
  }

  let streak = 0;

  // Check up to 100 days back
  for (let i = 0; i < 100; i++) {
    // Check if any PushEvent happened on this UTC day
    const hasCommit = events.some((event) => {
      if (event.type !== "PushEvent") return false;
      const eventDate = new Date(event.created_at);
      const eventUTC = getUTCDateOnly(eventDate);
      return eventUTC.getTime() === currentDate.getTime();
    });

    if (hasCommit) {
      streak++;
      console.log(`✅ Commit found on ${currentDate.toISOString().split('T')[0]}`);
    } else {
      console.log(`❌ No commit on ${currentDate.toISOString().split('T')[0]}, streak ends`);
      break;
    }

    // Move to previous day
    currentDate = new Date(currentDate);
    currentDate.setUTCDate(currentDate.getUTCDate() - 1);
  }

  console.log(`🏆 Final streak: ${streak} days`);
  return streak;
}

/**
 * Get recent activity (Push, PR, Issue, etc.)
 * @param {Array} events - GitHub events
 * @param {number} limit - Max number of items
 * @returns {Array} - Formatted activity
 */
export function getRecentActivity(events, limit = 5) {
  if (!events || !Array.isArray(events)) return [];

  return events
    .filter((event) =>
      ["PushEvent", "IssuesEvent", "PullRequestEvent", "CreateEvent"].includes(event.type)
    )
    .slice(0, limit)
    .map((event) => {
      const repoName = event.repo?.name?.split('/')[1] || event.repo?.name || 'Unknown';
      const type = event.type.replace("Event", "");
      const createdAt = new Date(event.created_at);
      const timeAgo = getTimeAgo(createdAt);

      return {
        type,
        repo: repoName,
        createdAt: createdAt.toLocaleDateString(),
        timeAgo,
        fullDate: createdAt.toLocaleString(),
      };
    });
}

/**
 * Helper: Format time ago (e.g., "2h ago")
 */
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

/**
 * Calculate activity stats (weekly/monthly commits, etc.)
 */
export function calculateActivityStats(events) {
  if (!events || !Array.isArray(events)) {
    return {
      totalCommitsThisWeek: 0,
      totalCommitsThisMonth: 0,
      uniqueReposThisWeek: 0,
      totalEventsThisWeek: 0,
      avgCommitsPerDay: 0,
      mostActiveRepo: null,
    };
  }

  // Get current date in UTC
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  
  // Calculate dates in UTC
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setUTCDate(today.getUTCDate() - 7);
  
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setUTCDate(today.getUTCDate() - 30);

  const weeklyEvents = events.filter(event => {
    const eventDate = new Date(event.created_at);
    const eventUTCDate = new Date(Date.UTC(
      eventDate.getUTCFullYear(), 
      eventDate.getUTCMonth(), 
      eventDate.getUTCDate()
    ));
    return eventUTCDate >= oneWeekAgo && eventUTCDate <= today;
  });

  const monthlyEvents = events.filter(event => {
    const eventDate = new Date(event.created_at);
    const eventUTCDate = new Date(Date.UTC(
      eventDate.getUTCFullYear(), 
      eventDate.getUTCMonth(), 
      eventDate.getUTCDate()
    ));
    return eventUTCDate >= oneMonthAgo && eventUTCDate <= today;
  });

  const weeklyPushEvents = weeklyEvents.filter(e => e.type === 'PushEvent');
  const monthlyPushEvents = monthlyEvents.filter(e => e.type === 'PushEvent');

  const totalCommitsThisWeek = weeklyPushEvents.reduce((sum, e) => sum + (e.payload?.size || 1), 0);
  const totalCommitsThisMonth = monthlyPushEvents.reduce((sum, e) => sum + (e.payload?.size || 1), 0);

  const uniqueReposThisWeek = new Set(weeklyEvents.map(e => e.repo?.name).filter(Boolean)).size;

  const repoActivity = {};
  weeklyPushEvents.forEach(event => {
    if (event.repo?.name) {
      const repoName = event.repo.name.split('/')[1] || event.repo.name;
      repoActivity[repoName] = (repoActivity[repoName] || 0) + (event.payload?.size || 1);
    }
  });

  const mostActiveRepo = Object.entries(repoActivity).length > 0
    ? Object.entries(repoActivity).reduce((a, b) => a[1] > b[1] ? a : b)
    : null;

  return {
    totalCommitsThisWeek,
    totalCommitsThisMonth,
    uniqueReposThisWeek,
    totalEventsThisWeek: weeklyEvents.length,
    avgCommitsPerDay: totalCommitsThisWeek > 0 ? (totalCommitsThisWeek / 7).toFixed(1) : 0,
    mostActiveRepo: mostActiveRepo ? { name: mostActiveRepo[0], commits: mostActiveRepo[1] } : null,
  };
}

/**
 * Calculate repo stats
 */
export function calculateRepoStats(repos) {
  if (!repos || !Array.isArray(repos)) return {
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    languagesUsed: 0,
    forkedRepos: 0,
    originalRepos: 0,
    privateRepos: 0,
  };

  const languages = new Set(repos.map(r => r.language).filter(Boolean));

  return {
    totalRepos: repos.length,
    totalStars: repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0),
    totalForks: repos.reduce((sum, r) => sum + (r.forks_count || 0), 0),
    languagesUsed: languages.size,
    forkedRepos: repos.filter(r => r.fork).length,
    originalRepos: repos.filter(r => !r.fork).length,
    privateRepos: repos.filter(r => r.private).length,
  };
}

/**
 * Generate contribution heatmap data
 */
export function getContributionData(events) {
  if (!events || !Array.isArray(events)) return [];

  const weeks = 12;
  const contributionMap = new Map();

  events.forEach(event => {
    if (event.type === 'PushEvent') {
      const date = new Date(event.created_at);
      // Use UTC date for consistency
      const dateKey = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      const commits = event.payload?.size || 1;
      contributionMap.set(dateKey, (contributionMap.get(dateKey) || 0) + commits);
    }
  });

  const contributions = [];
  // Get current date in UTC
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  for (let week = 0; week < weeks; week++) {
    const weekData = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(todayUTC);
      date.setUTCDate(date.getUTCDate() - ((weeks - 1 - week) * 7) - (6 - day));
      const dateKey = date.getTime();
      weekData.push(contributionMap.get(dateKey) || 0);
    }
    contributions.push(weekData);
  }

  return contributions;
}