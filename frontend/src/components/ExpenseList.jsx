import React from 'react';

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  if (!expenses.length) {
    return <p className="text-sm text-slate-400 mt-4">No expenses for this month yet.</p>;
  }

  return (
    <div className="mt-4 border border-slate-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-900/80">
          <tr className="text-left">
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Title</th>
            <th className="px-3 py-2">Category</th>
            <th className="px-3 py-2 text-right">Amount</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id} className="border-t border-slate-800/80">
              <td className="px-3 py-2 text-slate-300">
                {new Date(exp.date).toISOString().slice(0, 10)}
              </td>
              <td className="px-3 py-2">{exp.title}</td>
              <td className="px-3 py-2 text-slate-300">{exp.category}</td>
              <td className="px-3 py-2 text-right font-medium text-emerald-300">
                ${exp.amount.toFixed(2)}
              </td>
              <td className="px-3 py-2 text-right space-x-2">
                <button
                  onClick={() => onEdit(exp)}
                  className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(exp._id)}
                  className="px-2 py-1 text-xs rounded bg-red-600/80 hover:bg-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
