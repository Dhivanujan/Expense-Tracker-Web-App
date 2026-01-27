import React from 'react';

const SummaryCards = ({ totalAmount, monthLabel }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm group hover:border-emerald-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
           <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        <p className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Total spent ({monthLabel})</p>
        <p className="text-4xl font-bold text-white tracking-tight">
          ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Your monthly overview</span>
        </div>
      </div>
      
      {/* Placeholder for future cards (e.g. Budget vs Actual, Daily Average) */}
      <div className="hidden sm:block rounded-xl border border-slate-800 bg-slate-900/20 p-6 flex flex-col justify-center items-center text-center opacity-60 hover:opacity-100 transition-opacity cursor-default">
         <p className="text-sm text-slate-500">More insights coming soon</p>
         <p className="text-xs text-slate-600 mt-1">Budget goals, daily averages & trends</p>
      </div>
    </div>
  );
};

export default SummaryCards;
