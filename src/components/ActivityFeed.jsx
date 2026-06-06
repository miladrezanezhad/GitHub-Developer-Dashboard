import React, { useMemo } from 'react';

export default function ActivityFeed({ repos }) {
  const activities = useMemo(() => {
    const list = [];

    repos.forEach(repo => {
      if (repo.pushed_at) {
        list.push({
          id: `push-${repo.id}`,
          type: 'push',
          repoName: repo.name,
          url: repo.html_url,
          timestamp: new Date(repo.pushed_at),
          description: `Pushed commits to ${repo.default_branch || 'main'}`
        });
      }
      if (repo.created_at) {
        list.push({
          id: `create-${repo.id}`,
          type: 'create',
          repoName: repo.name,
          url: repo.html_url,
          timestamp: new Date(repo.created_at),
          description: `Created repository`
        });
      }
      if (repo.fork) {
        list.push({
          id: `fork-${repo.id}`,
          type: 'fork',
          repoName: repo.name,
          url: repo.html_url,
          timestamp: new Date(repo.updated_at),
          description: `Forked from upstream`
        });
      } else if (repo.stargazers_count > 0) {
        list.push({
          id: `star-${repo.id}`,
          type: 'star',
          repoName: repo.name,
          url: repo.html_url,
          timestamp: new Date(repo.updated_at),
          description: `Received stargazers`
        });
      }
    });

    return list
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 8);
  }, [repos]);

  const timeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins || 1}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getIcon = (type) => {
    switch (type) {
      case 'push': return '🌿';
      case 'create': return '✨';
      case 'fork': return '🍴';
      case 'star': return '⭐';
      default: return '⚡';
    }
  };

  return (
    <div className="activity-container">
      <h3>Latest Activity</h3>
      {activities.length === 0 ? (
        <p className="no-activity">No recent timeline logs detected.</p>
      ) : (
        <div className="activity-timeline">
          {activities.map(act => (
            <div key={act.id} className="activity-item">
              <span className="activity-icon">{getIcon(act.type)}</span>
              <div className="activity-content">
                <span className="activity-text">
                  {act.description} <a href={act.url} target="_blank" rel="noopener noreferrer" className="activity-repo-link">{act.repoName}</a>
                </span>
                <span className="activity-time">{timeAgo(act.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}