import React from 'react';

export default function Stats({ profile, repos }) {
  const totalRepos = profile?.public_repos || repos.length;
  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);

  const langMap = {};
  repos.forEach(repo => {
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] || 0) + 1;
    }
  });

  const topLanguage = Object.keys(langMap).reduce((a, b) => langMap[a] > langMap[b] ? a : b, 'None');

  return (
    <div className="stats-container">
      <div className="stat-card">
        <span className="stat-icon">📁</span>
        <div className="stat-info">
          <h3>{totalRepos}</h3>
          <p>Total Repositories</p>
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-icon">⭐</span>
        <div className="stat-info">
          <h3>{totalStars}</h3>
          <p>Total Stars</p>
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-icon">🍴</span>
        <div className="stat-info">
          <h3>{totalForks}</h3>
          <p>Total Forks</p>
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-icon">💻</span>
        <div className="stat-info">
          <h3>{topLanguage}</h3>
          <p>Primary Language</p>
        </div>
      </div>
    </div>
  );
}