import React, { useEffect, useState } from 'react';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'];

const ExpenseForm = ({ onSubmit, initialData, loading }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAmount(initialData.amount?.toString() || '');
      setCategory(initialData.category || 'Food');
      setDate(initialData.date?.slice(0, 10) || '');
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !date) return;

    onSubmit({
      title,
      amount: parseFloat(amount),
      category,
      date,
      description,
    });

    if (!initialData) {
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Title</label>
          <input
            className="w-full rounded-lg bg-slate-950/50 border border-slate-700/60 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all hover:bg-slate-900"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Grocery shopping"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-500">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-lg bg-slate-950/50 border border-slate-700/60 pl-7 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all hover:bg-slate-900"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Category</label>
          <select
            className="w-full rounded-lg bg-slate-950/50 border border-slate-700/60 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all hover:bg-slate-900"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Date</label>
          <input
            type="date"
            className="w-full rounded-lg bg-slate-950/50 border border-slate-700/60 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all hover:bg-slate-900 [color-scheme:dark]"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Description (optional)</label>
          <input
            className="w-full rounded-lg bg-slate-950/50 border border-slate-700/60 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all hover:bg-slate-900"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some details..."
          />
        </div>
      </div>
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          {initialData ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
