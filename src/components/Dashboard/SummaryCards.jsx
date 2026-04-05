import React from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, DollarSign, PieChart, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SummaryCards = () => {
  const { getTotalBalance, getTotalIncome, getTotalExpenses } = useApp();
  
  // Calculate percentages for trends (mock data for demo)
  const getTrend = (type) => {
    const trends = {
      balance: { value: 12.5, positive: true },
      income: { value: 8.2, positive: true },
      expenses: { value: 3.1, positive: false }
    };
    return trends[type];
  };
  
  const cards = [
    {
      title: 'Total Balance',
      value: getTotalBalance(),
      icon: Wallet,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-100',
      textColor: 'text-blue-600',
      shadowColor: 'shadow-blue-500/20',
      trend: getTrend('balance'),
      secondaryIcon: DollarSign,
      description: 'Available funds'
    },
    {
      title: 'Total Income',
      value: getTotalIncome(),
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-100',
      textColor: 'text-green-600',
      shadowColor: 'shadow-green-500/20',
      trend: getTrend('income'),
      secondaryIcon: Activity,
      description: 'This month'
    },
    {
      title: 'Total Expenses',
      value: getTotalExpenses(),
      icon: TrendingDown,
      gradient: 'from-red-500 to-orange-500',
      bgGradient: 'from-red-50 to-orange-50',
      borderColor: 'border-red-100',
      textColor: 'text-red-600',
      shadowColor: 'shadow-red-500/20',
      trend: getTrend('expenses'),
      secondaryIcon: PieChart,
      description: 'Total spent'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Animated background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-20 rounded-full transform translate-x-16 -translate-y-16 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white to-transparent opacity-0 group-hover:opacity-20 rounded-full transform -translate-x-12 translate-y-12 transition-all duration-700 delay-100"></div>
          
          {/* Main content */}
          <div className="relative p-6">
            {/* Header with icon and trend */}
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <card.icon className="w-7 h-7 text-white" />
              </div>
              
              {/* Trend indicator */}
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-white shadow-sm border ${card.borderColor} group-hover:scale-105 transition-transform duration-300`}>
                {card.trend.positive ? (
                  <ArrowUpRight className={`w-3.5 h-3.5 text-green-500`} />
                ) : (
                  <ArrowDownRight className={`w-3.5 h-3.5 text-red-500`} />
                )}
                <span className={`text-sm font-semibold ${card.trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trend.value}%
                </span>
              </div>
            </div>
            
            {/* Value and title */}
            <div className="mb-4">
              <p className="text-gray-500 text-sm font-medium mb-1 flex items-center gap-1">
                <card.secondaryIcon className="w-3.5 h-3.5" />
                {card.title}
              </p>
              <p className={`text-3xl font-bold ${card.textColor} mb-2 tracking-tight`}>
                ${card.value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">{card.description}</p>
            </div>
            
            {/* Progress bar */}
            <div className="relative">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transform origin-left transition-all duration-1000 ease-out group-hover:scale-x-110`}
                  style={{ 
                    width: `${Math.min(100, (card.value / 10000) * 100)}%`,
                    transition: 'width 1s ease-out'
                  }}
                />
              </div>
              
              {/* Animated dots */}
              <div className="absolute -top-1 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-100"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
            
            {/* Additional info */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400">vs last month</span>
              <span className={`font-medium ${card.trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {card.trend.positive ? '+' : '-'}{card.trend.value}%
              </span>
            </div>
          </div>
          
          {/* Glow effect on hover */}
          <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 pointer-events-none`}></div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;