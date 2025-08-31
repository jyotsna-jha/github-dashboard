const USERNAME = "jyotsna-jha";
const TOKEN = "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"; // 👈 Get from GitHub Settings

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