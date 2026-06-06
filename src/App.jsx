import React from 'react';
import { useGithub } from './hooks/useGithub';
import Profile from './components/Profile';
import Stats from './components/Stats';
import RepoList from './components/RepoList';
import ContributionGraph from './components/ContributionGraph';
import ActivityFeed from './components/ActivityFeed';

export default function App() {
  const { loading, error, profile, repos, contributions, refetch, lastUpdated } = useGithub();

  const handleRefresh = (e) => {
    e.preventDefault();
    refetch();
  };

  if (loading && !profile) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Syncing with GitHub live metrics...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="error-screen">
        <div className="error-card">
          <h2>Failed to Connect</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-btn">Retry Connection</button>
        </div>
      </div>
    );
  }

  const languageStats = () => {
    const counts = {};
    let total = 0;
    repos.forEach(repo => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
        total++;
      }
    });

    return Object.entries(counts)
      .map(([lang, count]) => ({
        name: lang,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
  };

  const topLanguages = languageStats();

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="navbar-left">
          <span className="nav-logo">🐙</span>
          <span className="nav-title">GitHub Developer Dashboard</span>
        </div>
        <div className="navbar-right">
          {lastUpdated && (
            <span className="cache-status">
              Sync State: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button onClick={handleRefresh} className="sync-btn" disabled={loading}>
            {loading ? 'Syncing...' : '🔄 Force Sync'}
          </button>
        </div>
      </header>

      <main className="dashboard-layout">
        <aside className="sidebar">
          <Profile profile={profile} />
          
          <div className="sidebar-section languages-section">
            <h3>Top Languages</h3>
            <div className="languages-list">
              {topLanguages.length === 0 ? (
                <p className="no-activity">No language statistics found.</p>
              ) : (
                topLanguages.map(lang => (
                  <div key={lang.name} className="lang-bar-wrapper">
                    <div className="lang-bar-label">
                      <span>{lang.name}</span>
                      <span>{lang.percentage}%</span>
                    </div>
                    <div className="lang-progress-bg">
                      <div 
                        className="lang-progress-fill" 
                        style={{ 
                          width: `${lang.percentage}%`,
                          backgroundColor: getLanguageColor(lang.name)
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        <section className="main-content">
          <Stats profile={profile} repos={repos} />
          <ContributionGraph contributions={contributions} repos={repos} />
          
          <div className="content-grid">
            <div className="left-panel">
              <RepoList repos={repos} />
            </div>
            <div className="right-panel">
              <ActivityFeed repos={repos} />
            </div>
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <p>Data automatically refreshed every hour. Built mimicking native GitHub styles.</p>
      </footer>
    </div>
  );
}

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

function getLanguageColor(lang) {
  return LANGUAGE_COLORS[lang] || '#8b949e';
}