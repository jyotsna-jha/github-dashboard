// Your existing functions
export function formatWeeklyCommits(events) {
  const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const commitCount = Array(7).fill(0);

  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  events.forEach((event) => {
    if (event.type === "PushEvent") {
      const date = new Date(event.created_at);
      if (date > oneWeekAgo) {
        const day = date.getDay();
        commitCount[day] += event.payload.size || 1;
      }
    }
  });

  return week.map((day, i) => ({
    name: day,
    commits: commitCount[i],
  }));
}

export function getCurrentStreak(events) {
  const today = new Date();
  let streak = 0;
  let current = new Date(today);

  while (streak < 30) {
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.created_at);
      return (
        event.type === "PushEvent" &&
        eventDate.toDateString() === current.toDateString()
      );
    });

    if (dayEvents.length > 0) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function getRecentActivity(events, limit = 5) {
  return events
    .filter((event) => ["PushEvent", "IssuesEvent", "PullRequestEvent"].includes(event.type))
    .slice(0, limit)
    .map((event) => {
      const repo = event.repo.name;
      const type = event.type.replace("Event", "");
      const createdAt = new Date(event.created_at).toLocaleDateString();
      return { type, repo, createdAt };
    });
}

// New enhanced data calculation functions
export function calculateActivityStats(events) {
  if (!events || !Array.isArray(events)) return {
    totalCommitsThisWeek: 0,
    totalCommitsThisMonth: 0,
    uniqueReposThisWeek: 0,
    totalEventsThisWeek: 0,
    avgCommitsPerDay: 0,
    mostActiveRepo: null
  };
  
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const weeklyEvents = events.filter(event => new Date(event.created_at) > oneWeekAgo);
  const monthlyEvents = events.filter(event => new Date(event.created_at) > oneMonthAgo);
  
  // Calculate total commits
  const totalCommitsThisWeek = weeklyEvents
    .filter(event => event.type === 'PushEvent')
    .reduce((sum, event) => sum + (event.payload?.size || 1), 0);
    
  const totalCommitsThisMonth = monthlyEvents
    .filter(event => event.type === 'PushEvent')
    .reduce((sum, event) => sum + (event.payload?.size || 1), 0);
  
  // Calculate unique repositories
  const uniqueReposThisWeek = new Set(
    weeklyEvents.map(event => event.repo?.name).filter(Boolean)
  ).size;
  
  // Find most active repository
  const repoActivity = {};
  weeklyEvents.forEach(event => {
    if (event.type === 'PushEvent' && event.repo?.name) {
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
    avgCommitsPerDay: Math.round(totalCommitsThisWeek / 7),
    mostActiveRepo: mostActiveRepo ? {
      name: mostActiveRepo[0],
      commits: mostActiveRepo[1]
    } : null
  };
}

export function calculateRepoStats(repos) {
  if (!repos || !Array.isArray(repos)) return {
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    languagesUsed: 0,
    publicRepos: 0,
    privateRepos: 0
  };
  
  const languages = new Set(repos.map(repo => repo.language).filter(Boolean));
  
  return {
    totalRepos: repos.length,
    totalStars: repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
    totalForks: repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
    languagesUsed: languages.size,
    publicRepos: repos.filter(repo => !repo.private).length,
    privateRepos: repos.filter(repo => repo.private).length,
    totalSize: repos.reduce((sum, repo) => sum + (repo.size || 0), 0),
    forkedRepos: repos.filter(repo => repo.fork).length,
    originalRepos: repos.filter(repo => !repo.fork).length
  };
}

export function getContributionData(events) {
  const weeks = 12;
  const contributionMap = {};
  
  // Process events to create contribution map
  events.forEach(event => {
    if (event.type === 'PushEvent') {
      const date = new Date(event.created_at);
      const dateKey = date.toDateString();
      contributionMap[dateKey] = (contributionMap[dateKey] || 0) + (event.payload?.size || 1);
    }
  });
  
  // Generate last 12 weeks of data
  const contributions = [];
  const today = new Date();
  
  for (let week = weeks - 1; week >= 0; week--) {
    const weekData = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (week * 7) - day);
      const dateKey = date.toDateString();
      weekData.push(contributionMap[dateKey] || 0);
    }
    contributions.push(weekData);
  }
  
  return contributions;
}