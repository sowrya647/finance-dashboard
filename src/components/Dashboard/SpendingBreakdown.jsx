import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useApp } from '../../context/AppContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingBreakdown = () => {
  const { getSpendingByCategory } = useApp();
  const spendingData = getSpendingByCategory();
  
  const categories = Object.keys(spendingData);
  const amounts = Object.values(spendingData);
  
  const colors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(249, 115, 22, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(236, 72, 153, 0.8)',
  ];

  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: colors,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#1f2937',
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Breakdown</h3>
      <div className="h-80">
        {categories.length > 0 ? (
          <Pie data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No spending data available
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendingBreakdown;