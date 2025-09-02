const USERNAME = "jyotsna-jha";
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN; // 👈 for Vite

const headers = {
  'Authorization': `token ${TOKEN}`,
  'Accept': 'application/vnd.github.v3+json'
};

// Add cache busting to prevent stale data
const getCacheBustingUrl = (url) => {
  const timestamp = new Date().getTime();
  return `${url}${url.includes('?') ? '&' : '?'}_=${timestamp}`;
};

export async function fetchGitHubActivity() {
  try {
    const res = await fetch(getCacheBustingUrl(`https://api.github.com/users/${USERNAME}/events`), {
      headers
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = await res.json();
    console.log("Raw GitHub Events:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch GitHub data:", err);
    throw err;
  }
}

// New function to fetch user profile data
export async function fetchGitHubUserData() {
  try {
    const res = await fetch(getCacheBustingUrl(`https://api.github.com/users/${USERNAME}`), {
      headers
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = await res.json();
    console.log("GitHub User Data:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch GitHub user data:", err);
    throw err;
  }
}

// New function to fetch user repositories
export async function fetchGitHubRepos() {
  try {
    const res = await fetch(getCacheBustingUrl(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`), {
      headers
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = await res.json();
    console.log("GitHub Repos Data:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch GitHub repos data:", err);
    throw err;
  }
}

// Combined function to fetch all GitHub data at once
export async function fetchAllGitHubData() {
  try {
    const [events, userData, repos] = await Promise.all([
      fetchGitHubActivity(),
      fetchGitHubUserData(),
      fetchGitHubRepos()
    ]);

    return {
      events,
      user: userData,
      repos
    };
  } catch (err) {
    console.error("Failed to fetch complete GitHub data:", err);
    throw err;
  }
}