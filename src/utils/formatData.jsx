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