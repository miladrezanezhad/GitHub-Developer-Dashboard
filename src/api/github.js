const USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'miladrezanezhad';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';

const CACHE_PREFIX = 'gh_dash_';
const CACHE_TTL = 3600000; // 1 hour

function getCache(key) {
  const cached = localStorage.getItem(CACHE_PREFIX + key);
  if (!cached) return null;
  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    }
  } catch (e) {
    localStorage.removeItem(CACHE_PREFIX + key);
  }
  return null;
}

function setCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.error('Failed to set cache:', e);
  }
}

async function fetchWithCache(url, cacheKey) {
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const headers = {};
  if (TOKEN && url.includes('api.github.com')) {
    headers['Authorization'] = `token ${TOKEN}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText} (${response.status})`);
  }
  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

export async function getUserProfile() {
  return fetchWithCache(`https://api.github.com/users/${USERNAME}`, `user_${USERNAME}`);
}

export async function getUserRepos() {
  return fetchWithCache(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`, `repos_${USERNAME}`);
}

export async function getUserContributions() {
  return fetchWithCache(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`, `contributions_${USERNAME}`);
}

export async function getUserSocials() {
  return fetchWithCache(`https://api.github.com/users/${USERNAME}/social_accounts`, `socials_${USERNAME}`);
}