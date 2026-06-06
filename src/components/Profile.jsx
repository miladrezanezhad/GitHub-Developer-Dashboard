import React from 'react';

export default function Profile({ profile }) {
  if (!profile) return null;

  return (
    <div className="profile-container">
      <div className="profile-avatar-wrapper">
        <img src={profile.avatar_url} alt={`${profile.name || profile.login}'s avatar`} className="profile-avatar" />
      </div>
      <div className="profile-info">
        <h1 className="profile-name">{profile.name || profile.login}</h1>
        <p className="profile-username">@{profile.login}</p>
        {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        
        <div className="profile-meta">
          {profile.location && (
            <span className="profile-meta-item">
              <span className="meta-icon">📍</span> {profile.location}
            </span>
          )}
          {profile.blog && (
            <span className="profile-meta-item">
              <span className="meta-icon">🔗</span> <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noopener noreferrer">{profile.blog}</a>
            </span>
          )}
        </div>

        <div className="profile-stats">
          <span className="profile-stat-item">
            <strong>{profile.followers}</strong> followers
          </span>
          <span className="profile-stat-item">
            <strong>{profile.following}</strong> following
          </span>
        </div>

        <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="github-btn">
          View GitHub Profile
        </a>
      </div>
    </div>
  );
}