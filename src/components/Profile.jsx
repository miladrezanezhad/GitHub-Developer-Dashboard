import React from 'react';

const EnvelopeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0114.25 14H1.75A1.75 1.75 0 010 12.25v-8.5C0 2.784.784 2 1.75 2zM1.5 12.25c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-6.31l-5.694 3.796a1.25 1.25 0 01-1.391 0L1.5 5.94v6.31zM1.5 4.305v.26l5.776 3.851a.25.25 0 00.278 0l5.776-3.851v-.26a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25z"/>
  </svg>
);

const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a3.5 3.5 0 114.95 4.95l-2.5 2.5a3.5 3.5 0 01-4.95 0 .75.75 0 00-1.06 1.06 5 5 0 007.07 0l2.5-2.5a5 5 0 00-7.07-7.07l-1.25 1.25zm-4.2 4.2a.75.75 0 00-1.06-.01l-1.25 1.25a5 5 0 007.07 7.07l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a3.5 3.5 0 11-4.95-4.95l2.5-2.5a3.5 3.5 0 014.95 0 .75.75 0 001.06-1.06 5 5 0 00-7.07 0l-2.5 2.5z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 1.25C0 .56.56 0 1.25 0h13.5C15.44 0 16 .56 16 1.25v13.5c0 .69-.56 1.25-1.25 1.25H1.25C.56 16 0 15.44 0 14.75V1.25zM4.91 13V6.09H2.62V13h2.29zm-1.15-7.9c.78 0 1.26-.52 1.26-1.17-.02-.67-.48-1.17-1.23-1.17s-1.26.5-1.26 1.17c0 .65.48 1.17 1.21 1.17h.02zm8.62 7.9V8.97c0-2.16-1.16-3.16-2.69-3.16-1.23 0-1.78.68-2.09 1.16V6.09H5.32c.03.64 0 6.91 0 6.91h2.29V9.15c0-.21.01-.41.08-.56.17-.41.54-.84 1.17-.84.82 0 1.15.63 1.15 1.55V13h2.29z"/>
  </svg>
);

export default function Profile({ profile, socials }) {
  if (!profile) return null;

  const combinedSocials = React.useMemo(() => {
    // Standard visual fallbacks derived from your metadata screenshot
    const map = {
      'email': {
        icon: <EnvelopeIcon />,
        display: 'miladvf2014@gmail.com',
        href: 'mailto:miladvf2014@gmail.com'
      },
      'telegram': {
        icon: <LinkIcon />,
        display: 'https://t.me/MRNOpenSource',
        href: 'https://t.me/MRNOpenSource'
      },
      'linkedin': {
        icon: <LinkedInIcon />,
        display: 'in/miladrn',
        href: 'https://www.linkedin.com/in/miladrn'
      },
      'devto': {
        icon: <LinkIcon />,
        display: 'https://dev.to/miladrezanezhad',
        href: 'https://dev.to/miladrezanezhad'
      }
    };

    // Override values dynamically if user is overridden in .env and provides custom social_accounts
    if (socials && socials.length > 0) {
      socials.forEach(item => {
        const url = item.url.toLowerCase();
        if (url.includes('t.me')) {
          map['telegram'] = { icon: <LinkIcon />, display: item.url, href: item.url };
        } else if (url.includes('linkedin.com')) {
          const parts = item.url.split('linkedin.com/');
          const handle = parts[1] || '';
          map['linkedin'] = { icon: <LinkedInIcon />, display: handle.startsWith('in/') ? handle : `in/${handle}`, href: item.url };
        } else if (url.includes('dev.to')) {
          map['devto'] = { icon: <LinkIcon />, display: item.url, href: item.url };
        }
      });
    }

    return Object.values(map);
  }, [socials]);

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

        {/* Unified Social Contacts Sidebar Block */}
        <div className="profile-social-accounts">
          {combinedSocials.map((social, index) => (
            <div key={index} className="social-account-row">
              <span className="social-icon-wrapper">{social.icon}</span>
              <a href={social.href} target="_blank" rel="noopener noreferrer" className="social-link">
                {social.display}
              </a>
            </div>
          ))}
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