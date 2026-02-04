import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const categoryColors = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Shopping: '#ec4899',
  Bills: '#eab308',
  Health: '#ef4444',
  Entertainment: '#8b5cf6',
  Other: '#64748b',
};

const categoryBgColors = {
  Food: 'bg-orange-500/10',
  Transport: 'bg-blue-500/10',
  Shopping: 'bg-pink-500/10',
  Bills: 'bg-yellow-500/10',
  Health: 'bg-red-500/10',
  Entertainment: 'bg-purple-500/10',
  Other: 'bg-slate-500/10',
};

const CategoryChart = ({ data }) => {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 flex items-center justify-center mb-4 ring-1 ring-slate-700/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center ring-2 ring-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
        </div>
        <p className="text-sm font-medium text-slate-400">No data to display</p>
        <p className="text-xs text-slate-500 mt-1">Add expenses to see the breakdown</p>
      </div>
    );
  }

  const labels = data.map((d) => d.category);
  const values = data.map((d) => d.totalAmount);
  const colors = data.map((d) => categoryColors[d.category] || categoryColors.Other);
  const total = values.reduce((sum, val) => sum + val, 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Expenses',
        data: values,
        backgroundColor: colors,
        borderColor: '#0f172a',
        borderWidth: 4,
        hoverBorderColor: '#1e293b',
        hoverBorderWidth: 5,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        titleFont: { weight: '600', size: 13 },
        bodyColor: '#cbd5e1',
        bodyFont: { size: 12 },
        borderColor: '#334155',
        borderWidth: 1,
        padding: 14,
        cornerRadius: 12,
        displayColors: true,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return ` $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="relative h-52">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-0.5">Total</span>
          <span className="text-2xl font-bold text-white number-display">${total.toFixed(0)}</span>
          <span className="text-[10px] text-slate-500 mt-0.5">{data.length} categories</span>
        </div>
      </div>
      
      {/* Custom Legend */}
      <div className="mt-5 pt-4 border-t border-slate-800/50 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
        {data.map((item, index) => {
          const percentage = ((item.totalAmount / total) * 100).toFixed(0);
          const bgColor = categoryBgColors[item.category] || categoryBgColors.Other;
          return (
            <div 
              key={item.category} 
              className={`flex items-center gap-2 text-xs group cursor-default py-1.5 px-2 rounded-lg hover:${bgColor} transition-all`}
            >
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0 transition-all group-hover:scale-110 ring-2 ring-slate-900" 
                style={{ backgroundColor: colors[index] }}
              ></div>
              <span className="text-slate-400 truncate group-hover:text-slate-300 transition-colors flex-1 font-medium">{item.category}</span>
              <span className="text-slate-500 font-bold tabular-nums">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChart;
