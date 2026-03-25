import React from 'react';

const formatCurrency = (value) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const SummaryCards = ({ totalAmount, monthLabel }) => {
  const [year, month] = (monthLabel || '').split('-').map(Number);
  const now = new Date();

  const validMonth = !Number.isNaN(year) && !Number.isNaN(month);
  const daysInMonth = validMonth ? new Date(year, month, 0).getDate() : 30;
  const isCurrentMonth =
    validMonth && now.getFullYear() === year && now.getMonth() + 1 === month;

  const elapsedDays = isCurrentMonth ? now.getDate() : daysInMonth;
  const remainingDays = Math.max(daysInMonth - elapsedDays, 0);
  const dailyAverage = elapsedDays > 0 ? totalAmount / elapsedDays : 0;
  const projectedMonthTotal = dailyAverage * daysInMonth;
  const budgetDelta = projectedMonthTotal - totalAmount;

  const formattedMonth = validMonth
    ? new Date(`${monthLabel}-01`).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Selected Month';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 mb-8">
      <article className="glass-card-premium p-5 sm:p-6 animate-fade-in-up">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500 font-semibold">Total Spent</p>
        <h3 className="font-display text-3xl mt-3 gradient-text-emerald number-display">₹{formatCurrency(totalAmount)}</h3>
        <p className="text-sm text-slate-400 mt-2">{formattedMonth}</p>
      </article>

      <article className="glass-card-premium p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500 font-semibold">Daily Average</p>
        <h3 className="font-display text-3xl mt-3 gradient-text-cyan number-display">₹{formatCurrency(dailyAverage)}</h3>
        <p className="text-sm text-slate-400 mt-2">
          Based on {elapsedDays} day{elapsedDays === 1 ? '' : 's'} logged
        </p>
      </article>

      <article className="glass-card-premium p-5 sm:p-6 animate-fade-in-up md:col-span-2 xl:col-span-1" style={{ animationDelay: '0.16s' }}>
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500 font-semibold">Forecast</p>
        <h3 className="font-display text-3xl mt-3 text-slate-100 number-display">₹{formatCurrency(projectedMonthTotal)}</h3>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-400">Days remaining</span>
          <span className="text-slate-200 font-semibold">{remainingDays}</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-sm">
          <span className="text-slate-400">Expected increase</span>
          <span className="text-teal-300 font-semibold number-display">₹{formatCurrency(Math.max(budgetDelta, 0))}</span>
        </div>
      </article>
    </div>
  );
};

export default SummaryCards;
