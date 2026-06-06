import { useState, useEffect, useCallback } from 'react';
import { getUserProfile, getUserRepos } from '../api/github';

export function useGithub() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ profile: null, repos: [] });
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      if (force) {
        const username = import.meta.env.VITE_GITHUB_USERNAME || 'miladrezanezhad';
        localStorage.removeItem(`gh_dash_user_${username}`);
        localStorage.removeItem(`gh_dash_repos_${username}`);
      }

      const [profile, repos] = await Promise.all([
        getUserProfile(),
        getUserRepos()
      ]);

      setData({ profile, repos });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'An error occurred fetching GitHub data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Auto-refresh every 1 hour (3600000 milliseconds)
    const interval = setInterval(() => {
      fetchData();
    }, 3600000);

    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    loading,
    error,
    profile: data.profile,
    repos: data.repos,
    refetch: () => fetchData(true),
    lastUpdated
  };
}