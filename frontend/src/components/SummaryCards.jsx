import React from 'react';

const SummaryCards = ({ totalAmount, monthLabel }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-xs text-slate-400 mb-1">Total spent ({monthLabel})</p>
        <p className="text-2xl font-semibold text-emerald-300">
          ${totalAmount.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
