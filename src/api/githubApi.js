// GitHub API functions
const GITHUB_API_BASE = 'https://api.github.com';

// Helper function to make authenticated requests
const githubFetch = async (endpoint, token) => {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('github_token');
      throw new Error('Authentication failed. Please login again.');
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Get user profile
export const fetchUserProfile = async (token) => {
  try {
    return await githubFetch('/user', token);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Get user repositories
export const fetchUserRepos = async (token, page = 1, perPage = 100) => {
  try {
    return await githubFetch(`/user/repos?sort=updated&per_page=${perPage}&page=${page}`, token);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};

// Get user events (activity)
export const fetchUserEvents = async (token, username, page = 1, perPage = 100) => {
  try {
    return await githubFetch(`/users/${username}/events?per_page=${perPage}&page=${page}`, token);
  } catch (error) {
    console.error('Error fetching user events:', error);
    throw error;
  }
};

// Main function to fetch all GitHub data
export const fetchAllGitHubData = async (token) => {
  try {
    console.log('🔄 Starting to fetch GitHub data...');
    
    // Get user profile first
    const user = await fetchUserProfile(token);
    console.log('✅ User profile fetched');

    // Get repositories
    const repos = await fetchUserRepos(token);
    console.log('✅ Repositories fetched:', repos.length);

    // Get user events (activity)
    const events = await fetchUserEvents(token, user.login);
    console.log('✅ Events fetched:', events.length);

    return {
      user,
      repos,
      events,
    };
  } catch (error) {
    console.error('❌ Error in fetchAllGitHubData:', error);
    throw error;
  }
};