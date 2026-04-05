import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useApp } from '../../context/AppContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BalanceTrend = () => {
  const { getMonthlySummary, selectedMonth, getTransactionsByMonth } = useApp();
  const monthlyData = getMonthlySummary();
  
  const isFiltered = selectedMonth !== null;
  
  let data;
  let chartTitle = 'Balance Trend';
  
  if (isFiltered && selectedMonth) {
    // Show daily breakdown for selected month
    chartTitle = `Daily Balance - ${selectedMonth.month} ${selectedMonth.year}`;
    const monthTransactions = getTransactionsByMonth(selectedMonth.year, selectedMonth.month);
    
    // Get days in month
    const monthIndex = new Date(Date.parse(selectedMonth.month + " 1, " + selectedMonth.year)).getMonth();
    const daysInMonth = new Date(selectedMonth.year, monthIndex + 1, 0).getDate();
    
    // Initialize daily data
    const dailyData = {};
    for (let i = 1; i <= daysInMonth; i++) {
      dailyData[i] = { income: 0, expenses: 0 };
    }
    
    // Aggregate transactions by day
    monthTransactions.forEach(t => {
      const day = new Date(t.date).getDate();
      if (t.type === 'income') {
        dailyData[day].income += t.amount;
      } else {
        dailyData[day].expenses += t.amount;
      }
    });
    
    // Calculate running balance
    let runningBalance = 0;
    const balanceData = [];
    const labels = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      runningBalance += dailyData[i].income - dailyData[i].expenses;
      balanceData.push(runningBalance);
      labels.push(i);
    }
    
    data = {
      labels: labels,
      datasets: [
        {
          label: 'Daily Balance',
          data: balanceData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        }
      ],
    };
  } else {
    // Show monthly trend (original behavior)
    data = {
      labels: monthlyData.map(item => `${item.month}`),
      datasets: [
        {
          label: 'Income',
          data: monthlyData.map(item => item.income),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Expenses',
          data: monthlyData.map(item => item.expenses),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Savings',
          data: monthlyData.map(item => item.savings),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        }
      ],
    };
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#1f2937',
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
          color: '#6b7280',
        },
        grid: {
          color: '#e5e7eb',
        }
      },
      x: {
        ticks: {
          color: '#6b7280',
        },
        grid: {
          color: '#e5e7eb',
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{chartTitle}</h3>
        {selectedMonth && (
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            Viewing daily breakdown
          </span>
        )}
      </div>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default BalanceTrend;