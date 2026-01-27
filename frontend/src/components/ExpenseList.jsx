import React from 'react';

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  if (!expenses.length) {
    return <p className="text-sm text-slate-400 mt-4">No expenses for this month yet.</p>;
  }

  return (
    <div className="mt-4 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40 backdrop-blur-sm shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-800 bg-slate-900/80">
              <th className="px-5 py-4 font-semibold text-slate-400 uppercase tracking-wider text-xs">Date</th>
              <th className="px-5 py-4 font-semibold text-slate-400 uppercase tracking-wider text-xs">Title</th>
              <th className="px-5 py-4 font-semibold text-slate-400 uppercase tracking-wider text-xs">Category</th>
              <th className="px-5 py-4 text-right font-semibold text-slate-400 uppercase tracking-wider text-xs">Amount</th>
              <th className="px-5 py-4 text-right font-semibold text-slate-400 uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {expenses.map((exp) => (
              <tr key={exp._id} className="group hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-4 whitespace-nowrap text-slate-300 font-medium">
                  {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-5 py-4 text-slate-100">
                  <div className="font-medium">{exp.title}</div>
                  {exp.description && <div className="text-xs text-slate-500 truncate max-w-[150px]">{exp.description}</div>}
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 result-xs font-medium bg-slate-800 text-slate-300 rounded-full border border-slate-700/50">
                    {exp.category}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-bold text-emerald-400 font-mono tracking-tight">
                  ${exp.amount.toFixed(2)}
                </td>
                <td className="px-5 py-4 text-right space-x-2">
                  <button
                    onClick={() => onEdit(exp)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button
                    onClick={() => onDelete(exp._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
