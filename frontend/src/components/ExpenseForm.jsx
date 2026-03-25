import React, { useEffect, useState } from 'react';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'];
const quickTitlesByCategory = {
  Food: ['Mess fee', 'Canteen meal', 'Snacks'],
  Transport: ['Bus pass', 'Auto fare', 'Cab share'],
  Shopping: ['Stationery', 'Toiletries', 'Laundry items'],
  Bills: ['Mobile recharge', 'Wi-Fi split', 'Electricity share'],
  Health: ['Medicine', 'Clinic visit', 'First-aid items'],
  Entertainment: ['Movie night', 'Cafe hangout', 'Streaming subscription'],
  Other: ['Misc expense', 'Emergency spend', 'Room essentials'],
};

const ExpenseForm = ({ onSubmit, onCancel, initialData, loading }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [hydratedExpenseId, setHydratedExpenseId] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const parsedAmount = Number.parseFloat(amount);
  const isAmountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const isDateValid = Boolean(date) && date <= today;
  const isFormValid = title.trim().length > 0 && isAmountValid && isDateValid;
  const quickTitles = quickTitlesByCategory[category] || quickTitlesByCategory.Other;

  useEffect(() => {
    const expenseId = initialData?._id || null;

    // Only hydrate when switching records to avoid clobbering in-progress edits.
    if (expenseId && expenseId !== hydratedExpenseId) {
      setTitle(initialData.title || '');
      setAmount(initialData.amount?.toString() || '');
      setCategory(initialData.category || 'Food');
      setDate(initialData.date?.slice(0, 10) || '');
      setDescription(initialData.description || '');
      setHydratedExpenseId(expenseId);
      return;
    }

    if (!expenseId && hydratedExpenseId !== null) {
      // Clear stale values only when leaving edit mode.
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate('');
      setDescription('');
      setHydratedExpenseId(null);
    }
  }, [initialData, hydratedExpenseId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const parsedAmount = Number.parseFloat(amount);

    if (!trimmedTitle || !isDateValid || Number.isNaN(parsedAmount) || parsedAmount <= 0) return;

    onSubmit({
      title: trimmedTitle,
      amount: parsedAmount,
      category,
      date,
      description: description.trim(),
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
    <form onSubmit={handleSubmit} className="space-y-6 text-sm animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </div>
            Title
          </label>
          <input
            name="title"
            className="input-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Mess dinner, bus pass"
            autoComplete="off"
            list="quick-expense-titles"
            required
          />
          <datalist id="quick-expense-titles">
            {quickTitles.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            Amount
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors pointer-events-none font-medium">₹</span>
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              className="input-field pl-9"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onWheel={(e) => e.currentTarget.blur()}
              placeholder="0.00"
              autoComplete="off"
              inputMode="decimal"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            </div>
            Category (Quick Select)
          </label>
          <div className="relative">
            <select
              name="category"
              className="input-field appearance-none cursor-pointer font-medium pr-10"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                  category === item
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                    : 'bg-slate-800/45 text-slate-400 border-slate-700/60 hover:text-slate-200'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            Date
          </label>
          <input
            name="date"
            type="date"
            className="input-field [color-scheme:dark] font-medium"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={today}
            required
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
            </div>
            Description <span className="text-slate-600 font-normal normal-case">(optional)</span>
          </label>
          <textarea
            name="description"
            className="input-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some details about this expense..."
            rows={2}
            maxLength={300}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="btn-primary flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed min-w-[160px] py-3"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              {initialData ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                  Update Expense
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Add Expense
                </>
              )}
            </>
          )}
        </button>
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary min-w-[130px] py-3"
          >
            Cancel Edit
          </button>
        )}
        {initialData && (
          <span className="text-xs text-slate-500 flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Editing expense
          </span>
        )}
      </div>
      {!isDateValid && date && (
        <p className="text-xs text-amber-300">Date cannot be in the future.</p>
      )}
    </form>
  );
};

export default ExpenseForm;
