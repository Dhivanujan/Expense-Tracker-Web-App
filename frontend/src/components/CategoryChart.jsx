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

const CategoryChart = ({ data }) => {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
        </div>
        <p className="text-sm text-slate-400">No data to display</p>
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
        borderWidth: 3,
        hoverBorderColor: '#1e293b',
        hoverBorderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
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
    },
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="relative h-48">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Total</span>
          <span className="text-xl font-bold text-white">${total.toFixed(0)}</span>
        </div>
      </div>
      
      {/* Custom Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((item, index) => {
          const percentage = ((item.totalAmount / total) * 100).toFixed(0);
          return (
            <div key={item.category} className="flex items-center gap-2 text-xs group cursor-default">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0 transition-transform group-hover:scale-125" 
                style={{ backgroundColor: colors[index] }}
              ></div>
              <span className="text-slate-400 truncate group-hover:text-slate-300 transition-colors">{item.category}</span>
              <span className="text-slate-500 ml-auto">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChart;
