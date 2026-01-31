import React from 'react';

const categoryColors = {
  Food: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', gradient: 'from-orange-500/20 to-orange-600/10', icon: '🍔' },
  Transport: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', gradient: 'from-blue-500/20 to-blue-600/10', icon: '🚗' },
  Shopping: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', gradient: 'from-pink-500/20 to-pink-600/10', icon: '🛍️' },
  Bills: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', gradient: 'from-yellow-500/20 to-yellow-600/10', icon: '📄' },
  Health: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', gradient: 'from-red-500/20 to-red-600/10', icon: '💊' },
  Entertainment: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', gradient: 'from-purple-500/20 to-purple-600/10', icon: '🎬' },
  Other: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', gradient: 'from-slate-500/20 to-slate-600/10', icon: '📌' },
};

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  if (!expenses.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 flex items-center justify-center mb-5 ring-1 ring-slate-700/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center ring-2 ring-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          </div>
        </div>
        <p className="text-lg font-semibold text-slate-300 mb-2">No expenses yet</p>
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed">Start tracking your spending by adding your first expense using the form above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-800/60 bg-slate-900/30">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="text-left border-b border-slate-800/80 bg-slate-900/80">
                <th className="px-5 py-4 font-semibold text-slate-400 uppercase tracking-wider text-xs w-24">Date</th>
                <th className="px-5 py-4 font-semibold text-slate-400 uppercase tracking-wider text-xs">Details</th>
                <th className="px-5 py-4 font-semibold text-slate-400 uppercase tracking-wider text-xs w-32">Category</th>
                <th className="px-5 py-4 text-right font-semibold text-slate-400 uppercase tracking-wider text-xs w-28">Amount</th>
                <th className="px-5 py-4 text-right font-semibold text-slate-400 uppercase tracking-wider text-xs w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {expenses.map((exp, index) => {
                const colors = categoryColors[exp.category] || categoryColors.Other;
                return (
                  <tr 
                    key={exp._id} 
                    className="group hover:bg-slate-800/40 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-medium">
                          {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {new Date(exp.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-lg ring-1 ${colors.border} group-hover:scale-105 transition-transform`}>
                          {colors.icon}
                        </div>
                        <div>
                          <div className="font-medium text-slate-100 group-hover:text-white transition-colors">{exp.title}</div>
                          {exp.description && <div className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">{exp.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold ${colors.bg} ${colors.text} rounded-lg border ${colors.border}`}>
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-bold text-emerald-400 number-display text-base">
                        ${exp.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => onEdit(exp)}
                          className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-500/20"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button
                          onClick={() => onDelete(exp._id)}
                          className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {expenses.map((exp, index) => {
          const colors = categoryColors[exp.category] || categoryColors.Other;
          return (
            <div 
              key={exp._id} 
              className="glass-card p-4 animate-slide-up group active:scale-[0.99] transition-transform"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-2xl ring-1 ${colors.border}`}>
                    {colors.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100">{exp.title}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${colors.bg} ${colors.text}`}>{exp.category}</span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-emerald-400 text-lg number-display">${exp.amount.toFixed(2)}</div>
                  <div className="flex items-center justify-end gap-1 mt-2">
                    <button onClick={() => onEdit(exp)} className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" aria-label="Edit expense">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button onClick={() => onDelete(exp._id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all" aria-label="Delete expense">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseList;
