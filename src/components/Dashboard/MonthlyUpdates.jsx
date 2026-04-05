import React, { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, DollarSign, ChevronDown, ChevronUp, Activity, Clock, BarChart3, Table, Filter, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const MonthlyUpdates = () => {
  const { 
    getMonthlySummary, 
    getMonthOverMonthGrowth, 
    getCurrentMonthData,
    setSelectedMonth,
    setSelectedMonthFilter,
    getMonthSummary,
    selectedMonth
  } = useApp();
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState('table');
  
  const monthlyData = getMonthlySummary();
  const currentMonth = getCurrentMonthData();
  const growth = getMonthOverMonthGrowth();
  
  // Filter data by year (show all if no year selected)
  const filteredData = selectedYear ? monthlyData.filter(item => item.year === selectedYear) : monthlyData;
  const years = [...new Set(monthlyData.map(item => item.year))].sort((a, b) => b - a);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle month click - updates pie chart AND filters transactions
  const handleMonthClick = (month, year) => {
    const monthData = getMonthSummary(year, month);
    setSelectedMonth({ month, year, ...monthData });
    setSelectedMonthFilter({ month, year });
    console.log('Selected month for charts and transactions:', month, year);
    
    // Scroll to pie chart section
    setTimeout(() => {
      const pieChartSection = document.getElementById('pie-chart-section');
      if (pieChartSection) {
        pieChartSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      } else {
        const chartsGrid = document.querySelector('.grid-cols-1.lg\\:grid-cols-2');
        if (chartsGrid) {
          chartsGrid.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }
    }, 100);
  };

  // Clear all filters (month and year)
  const clearAllFilters = () => {
    setSelectedMonth(null);
    setSelectedMonthFilter(null);
    setSelectedYear(null); // Clear year filter
    console.log('Cleared all filters');
  };

  // Clear only year filter
  const clearYearFilter = () => {
    setSelectedYear(null);
  };

  // Select year
  const selectYear = (year) => {
    setSelectedYear(year);
  };

  if (monthlyData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Monthly Updates</h2>
          <p className="text-indigo-100">Click on any month to filter charts and transactions</p>
        </div>
        <div className="p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No monthly data available</p>
          <p className="text-gray-400 text-sm mt-2">Add transactions to see monthly updates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Monthly Updates</h2>
            <p className="text-indigo-100">Click on any month to view detailed charts and transactions</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'table' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <Table className="w-4 h-4" />
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'cards' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {(selectedMonth || selectedYear) && (
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">Active Filters:</span>
              
              {selectedMonth && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                  Month: {selectedMonth.month} {selectedMonth.year}
                  <button onClick={() => {
                    setSelectedMonth(null);
                    setSelectedMonthFilter(null);
                  }} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {selectedYear && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                  Year: {selectedYear}
                  <button onClick={clearYearFilter} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
            
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Current Month Highlight */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Month</p>
              <p className="text-xl font-bold text-gray-900">{currentMonth.month} {currentMonth.year}</p>
            </div>
          </div>
          
          <div className="flex gap-6 flex-wrap">
            <div>
              <p className="text-xs text-gray-500">Income</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(currentMonth.income)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Expenses</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(currentMonth.expenses)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Savings</p>
              <p className={`text-lg font-bold ${currentMonth.savings >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {formatCurrency(currentMonth.savings)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">vs Last Month</p>
              <div className="flex items-center gap-1">
                {growth.trend === 'positive' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-lg font-bold ${growth.trend === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {growth.growth}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Year Selector with Clear Option */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Filter by Year:</span>
          <div className="flex gap-2 flex-wrap">
            {years.map(year => (
              <button
                key={year}
                onClick={() => selectYear(year)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedYear === year
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {filteredData.length} months with data
        </div>
      </div>

      {/* Monthly Data Display - Clickable */}
      <div className="p-6">
        {viewMode === 'table' ? (
          // Table View - Clickable rows
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 rounded-lg">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Month</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Income</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Expenses</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Savings</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Transactions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((month, index) => (
                  <tr 
                    key={index} 
                    onClick={() => handleMonthClick(month.month, month.year)}
                    className="hover:bg-blue-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 group-hover:text-blue-600">{month.month}</div>
                      <div className="text-xs text-gray-400">{month.year}</div>
                    </td>
                    <td className="px-4 py-3 text-green-600 font-medium">{formatCurrency(month.income)}</td>
                    <td className="px-4 py-3 text-red-600 font-medium">{formatCurrency(month.expenses)}</td>
                    <td className={`px-4 py-3 font-medium ${month.savings >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {formatCurrency(month.savings)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${month.savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {month.savingsRate}%
                        </span>
                        <div className="flex-1 max-w-20">
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${month.savingsRate >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.abs(month.savingsRate)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{month.transactionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No data available for selected filters</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        ) : (
          // Card View - Clickable cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((month, index) => (
              <div 
                key={index} 
                onClick={() => handleMonthClick(month.month, month.year)}
                className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:bg-blue-50 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{month.month}</h3>
                  <span className="text-xs text-gray-400">{month.year}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Income:</span>
                    <span className="text-green-600 font-medium">{formatCurrency(month.income)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expenses:</span>
                    <span className="text-red-600 font-medium">{formatCurrency(month.expenses)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Savings:</span>
                    <span className={`font-medium ${month.savings >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {formatCurrency(month.savings)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Savings Rate:</span>
                      <span className={`font-medium ${month.savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {month.savingsRate}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${month.savingsRate >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.abs(month.savingsRate)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p>No data available for selected filters</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Update Notification */}
      <div className="p-4 bg-blue-50 border-t border-blue-100">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <Clock className="w-4 h-4" />
          <span>Click on any month to see detailed breakdown in charts AND filtered transactions</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyUpdates;