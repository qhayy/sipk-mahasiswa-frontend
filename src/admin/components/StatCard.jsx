import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">{title}</p>
          <h3 className="text-3xl font-extrabold mt-2 text-slate-800 tracking-tight">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1.5 mt-4">
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}%
              </span>
              <span className="text-xs text-slate-400 font-medium">vs lalu</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${color} shadow-lg transition-transform group-hover:rotate-12 group-hover:scale-110`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;