import React, { useState, useMemo } from 'react';

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00'
};

export default function RepoList({ repos }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const languages = useMemo(() => {
    const list = new Set();
    repos.forEach(repo => {
      if (repo.language) list.add(repo.language);
    });
    return ['All', ...Array.from(list)];
  }, [repos]);

  const filteredRepos = useMemo(() => {
    return repos.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLanguage = selectedLanguage === 'All' || repo.language === selectedLanguage;
      return matchesSearch && matchesLanguage;
    });
  }, [repos, searchQuery, selectedLanguage]);

  const formatUpdateDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="repos-dashboard">
      <div className="repos-header">
        <h2>Repositories ({filteredRepos.length})</h2>
        <div className="filter-controls">
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="lang-select"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="repo-grid">
        {filteredRepos.length === 0 ? (
          <div className="no-repos">No repositories found matching your selection.</div>
        ) : (
          filteredRepos.map(repo => {
            const langColor = LANGUAGE_COLORS[repo.language] || '#8b949e';
            return (
              <div key={repo.id} className="repo-card">
                <div className="repo-card-header">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-link">
                    {repo.name}
                  </a>
                  <span className="repo-visibility">{repo.private ? 'Private' : 'Public'}</span>
                </div>
                {repo.description && <p className="repo-description">{repo.description}</p>}
                
                <div className="repo-meta-details">
                  {repo.language && (
                    <span className="repo-lang-wrapper">
                      <span className="repo-lang-dot" style={{ backgroundColor: langColor }}></span>
                      <span className="repo-lang">{repo.language}</span>
                    </span>
                  )}
                  {repo.stargazers_count > 0 && (
                    <span className="repo-metric">
                      ⭐ {repo.stargazers_count}
                    </span>
                  )}
                  {repo.forks_count > 0 && (
                    <span className="repo-metric">
                      🍴 {repo.forks_count}
                    </span>
                  )}
                  <span className="repo-updated-at">
                    Updated {formatUpdateDate(repo.updated_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}