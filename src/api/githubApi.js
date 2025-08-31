const USERNAME = "jyotsna-jha";
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN; // 👈 for Vite

export async function fetchGitHubActivity() {
  try {
    const res = await fetch(`https://api.github.com/users/${USERNAME}/events`, {
      headers: {
        'Authorization': `token ${TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
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
