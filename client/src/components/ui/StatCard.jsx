import React from 'react';

export const StatCard = ({ title, value, desc, icon: Icon, color = 'text-primary' }) => {
  return (
    <div className="stat bg-base-100 shadow rounded-box border border-base-300">
      {Icon && (
        <div className={`stat-figure ${color}`}>
          <Icon className="w-8 h-8" />
        </div>
      )}
      <div className="stat-title">{title}</div>
      <div className={`stat-value ${color}`}>{value}</div>
      <div className="stat-desc">{desc}</div>
    </div>
  );
};
