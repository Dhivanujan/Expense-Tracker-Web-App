import React from 'react';

const SummaryCards = ({ totalAmount, monthLabel }) => {
  const [year, month] = (monthLabel || '').split('-').map(Number);
  const daysInMonth = !isNaN(year) && !isNaN(month)
    ? new Date(year, month, 0).getDate()
    : 30;

  const dailyAverage = daysInMonth > 0 ? totalAmount / daysInMonth : 0;
  const formattedMonth = new Date((monthLabel || '') + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Calculate days passed and remaining
  const today = new Date();
  const daysPassed = today.getFullYear() === year && today.getMonth() + 1 === month 
    ? today.getDate() 
    : daysInMonth;
  const daysRemaining = daysInMonth - daysPassed;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      {/* Total Spent Card */}
      <div
        className="relative overflow-hidden glass-card-premium p-6 group hover:border-emerald-500/40 animate-fade-in-up cursor-default"
        aria-label="Total spent this month"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 group-hover:from-emerald-500/15 transition-all duration-700"></div>
        
        {/* Floating icon */}
        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-50 transition-all duration-500 group-hover:animate-bounce-soft">
          <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center ring-1 ring-emerald-500/20 group-hover:ring-emerald-500/40 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Spent</p>
              <p className="text-[10px] text-slate-600">{formattedMonth}</p>
            </div>
          </div>
          <p className="text-4xl font-bold gradient-text-emerald tracking-tight mb-2 number-display">
            ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400/80 bg-emerald-500/10 px-2 py-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline></svg>
              Active tracking
            </span>
          </div>
        </div>
        
        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      </div>

      {/* Daily Average Card */}
      <div
        className="relative overflow-hidden glass-card-premium p-6 group hover:border-cyan-500/40 animate-fade-in-up cursor-default"
        style={{ animationDelay: '0.1s' }}
        aria-label="Average spent per day this month"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 group-hover:from-cyan-500/15 transition-all duration-700"></div>
        
        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-50 transition-all duration-500 group-hover:animate-bounce-soft">
          <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center ring-1 ring-cyan-500/20 group-hover:ring-cyan-500/40 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daily Average</p>
              <p className="text-[10px] text-slate-600">Per day spending</p>
            </div>
          </div>
          <p className="text-4xl font-bold gradient-text-cyan tracking-tight mb-2 number-display">
            ${dailyAverage.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-cyan-400/80 bg-cyan-500/10 px-2 py-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line></svg>
              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Month complete'}
            </span>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/0 via-cyan-500/60 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      </div>

      {/* Quick Stats Card */}
      <div
        className="relative overflow-hidden glass-card-premium p-6 group hover:border-purple-500/40 sm:col-span-2 lg:col-span-1 animate-fade-in-up cursor-default"
        style={{ animationDelay: '0.2s' }}
        aria-label="Quick budget status overview"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 group-hover:from-purple-500/15 transition-all duration-700"></div>
        
        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-50 transition-all duration-500 group-hover:animate-bounce-soft">
          <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20v-4"></path></svg>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center ring-1 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget Status</p>
              <p className="text-[10px] text-slate-600">Monthly overview</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Status</span>
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                On Track
              </span>
            </div>
            <div className="relative">
              <div className="w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient relative"
                  style={{ width: '67%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">67% used</span>
              <span className="text-purple-400 font-medium">33% remaining</span>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500/0 via-purple-500/60 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      </div>
    </div>
  );
};

export default SummaryCards;
