import { useState, useEffect, useCallback } from 'react';
import { getUserProfile, getUserRepos, getUserContributions, getUserSocials } from '../api/github';

export function useGithub() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ profile: null, repos: [], contributions: null, socials: [] });
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const username = import.meta.env.VITE_GITHUB_USERNAME || 'miladrezanezhad';
      if (force) {
        localStorage.removeItem(`gh_dash_user_${username}`);
        localStorage.removeItem(`gh_dash_repos_${username}`);
        localStorage.removeItem(`gh_dash_contributions_${username}`);
        localStorage.removeItem(`gh_dash_socials_${username}`);
      }

      const [profile, repos, contributions, socials] = await Promise.all([
        getUserProfile(),
        getUserRepos(),
        getUserContributions().catch(() => null),
        getUserSocials().catch(() => [])
      ]);

      setData({ profile, repos, contributions, socials });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'An error occurred fetching GitHub data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

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
    contributions: data.contributions,
    socials: data.socials,
    refetch: () => fetchData(true),
    lastUpdated
  };
}