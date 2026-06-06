import React, { useMemo } from 'react';

export default function ContributionGraph({ contributions, repos }) {
  const { weeks, totalThisYear } = useMemo(() => {
    let rawDays = [];

    if (contributions && contributions.contributions && contributions.contributions.length > 0) {
      rawDays = contributions.contributions.map(day => ({
        date: day.date,
        count: day.count,
        level: day.level
      }));
    } else {
      const fallbackData = {};
      const today = new Date();
      for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];
        fallbackData[dateKey] = { count: 0, level: 0 };
      }

      repos.forEach(repo => {
        if (repo.pushed_at) {
          const pushDate = repo.pushed_at.split('T')[0];
          if (fallbackData[pushDate]) {
            fallbackData[pushDate].count += 3;
            fallbackData[pushDate].level = Math.min(4, fallbackData[pushDate].level + 2);
          }
        }
        if (repo.created_at) {
          const createDate = repo.created_at.split('T')[0];
          if (fallbackData[createDate]) {
            fallbackData[createDate].count += 5;
            fallbackData[createDate].level = Math.min(4, fallbackData[createDate].level + 3);
          }
        }
      });

      rawDays = Object.entries(fallbackData).map(([date, val]) => ({
        date,
        count: val.count,
        level: val.level
      }));
    }

    const alignedDays = [];
    if (rawDays.length > 0) {
      const firstDate = new Date(rawDays[0].date);
      const firstDayOfWeek = firstDate.getDay(); 

      for (let i = 0; i < firstDayOfWeek; i++) {
        alignedDays.push({ date: '', count: null, level: -1 });
      }
      alignedDays.push(...rawDays);
    }

    const chunkedWeeks = [];
    let tempWeek = [];

    alignedDays.forEach(day => {
      tempWeek.push(day);
      if (tempWeek.length === 7) {
        chunkedWeeks.push(tempWeek);
        tempWeek = [];
      }
    });

    if (tempWeek.length > 0) {
      while (tempWeek.length < 7) {
        tempWeek.push({ date: '', count: null, level: -1 });
      }
      chunkedWeeks.push(tempWeek);
    }

    const totalCount = rawDays.reduce((sum, item) => sum + (item.count || 0), 0);

    return { weeks: chunkedWeeks, totalThisYear: totalCount };
  }, [contributions, repos]);

  const getLevelColorClass = (level) => {
    if (level === -1) return 'level-empty';
    if (level === 0 || !level) return 'level-0';
    if (level === 1) return 'level-1';
    if (level === 2) return 'level-2';
    if (level === 3) return 'level-3';
    return 'level-4';
  };

  return (
    <div className="contribution-container">
      <div className="contribution-header">
        <h3>{totalThisYear.toLocaleString()} contributions in the last year</h3>
        <span className="real-data-badge">
          {contributions ? '● Real-Time Sync' : '⚠️ Offline Sandbox Mode'}
        </span>
      </div>
      
      <div className="graph-wrapper">
        {/* Y-Labels containing 7 rows mapped to the grid structure */}
        <div className="graph-y-labels">
          <span>Sun</span>
          <span className="label-hidden">Mon</span>
          <span>Tue</span>
          <span className="label-hidden">Wed</span>
          <span>Thu</span>
          <span className="label-hidden">Fri</span>
          <span>Sat</span>
        </div>
        
        <div className="graph-grid">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="graph-column">
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  className={`graph-cell ${getLevelColorClass(day.level)}`}
                  title={day.count !== null ? `${day.count} contributions on ${day.date}` : ''}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="graph-legend">
        <span>Less</span>
        <div className="legend-cell level-0"></div>
        <div className="legend-cell level-1"></div>
        <div className="legend-cell level-2"></div>
        <div className="legend-cell level-3"></div>
        <div className="legend-cell level-4"></div>
        <span>More</span>
      </div>
    </div>
  );
}