import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ data }) => {
  if (!data.length) {
    return (
      <p className="text-sm text-slate-400 mt-2">Add some expenses to see the chart.</p>
    );
  }

  const labels = data.map((d) => d.category);
  const values = data.map((d) => d.totalAmount);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Expenses by Category',
        data: values,
        backgroundColor: [
          '#22c55e',
          '#06b6d4',
          '#f97316',
          '#eab308',
          '#8b5cf6',
          '#ec4899',
          '#64748b',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e5e7eb',
        },
      },
    },
  };

  return (
    <div className="mt-2">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default CategoryChart;
