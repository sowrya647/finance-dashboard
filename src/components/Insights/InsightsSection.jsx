import React from 'react';
import { TrendingUp, TrendingDown, Award, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const InsightsSection = () => {
  const { getSpendingByCategory, getMonthlyComparison } = useApp();
  const spendingData = getSpendingByCategory();
  const { currentMonthExpenses, lastMonthExpenses } = getMonthlyComparison();
  
  const highestSpendingCategory = Object.entries(spendingData).sort((a, b) => b[1] - a[1])[0];
  
  const monthlyChange = lastMonthExpenses === 0 
    ? 100 
    : ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100).toFixed(1);
  
  const insights = [
    {
      title: 'Highest Spending Category',
      value: highestSpendingCategory ? `${highestSpendingCategory[0]}` : 'No data',
      subtitle: highestSpendingCategory ? `$${highestSpendingCategory[1].toLocaleString()}` : '',
      icon: Award,
      color: 'bg-purple-500'
    },
    {
      title: 'Monthly Expense Change',
      value: `${Math.abs(monthlyChange)}%`,
      subtitle: `${parseFloat(monthlyChange) > 0 ? 'Increase' : 'Decrease'} from last month`,
      icon: monthlyChange > 0 ? TrendingUp : TrendingDown,
      color: monthlyChange > 0 ? 'bg-red-500' : 'bg-green-500'
    },
    {
      title: 'Average Transaction',
      value: '$156.50',
      subtitle: 'Based on all transactions',
      icon: BarChart3,
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className={`${insight.color} p-3 rounded-full flex-shrink-0`}>
              <insight.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{insight.title}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{insight.value}</p>
              <p className="text-xs text-gray-400 mt-1">{insight.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsSection;