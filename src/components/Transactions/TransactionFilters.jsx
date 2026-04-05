import React, { useState } from 'react';
import { Search, Filter, X, Calendar, DollarSign, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { categories } from '../../data/mockData';

const TransactionFilters = () => {
  const { filters, setFilters, sortBy, setSortBy } = useApp();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleTypeChange = (e) => {
    setFilters({ ...filters, type: e.target.value });
  };

  const handleCategoryChange = (e) => {
    // Store the category as is (with proper casing)
    setFilters({ ...filters, category: e.target.value });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all'
    });
    setSortBy('date-desc');
  };

  const hasActiveFilters = filters.search !== '' || filters.type !== 'all' || filters.category !== 'all';

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={handleTypeChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        {/* Category Filter - Fixed casing issue */}
        <select
          value={filters.category}
          onChange={handleCategoryChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category === 'All' ? 'all' : category}>
              {category}
            </option>
          ))}
        </select>
        
        {/* Sort By */}
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">Active filters:</span>
              
              {filters.search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                  <Search className="w-3 h-3" />
                  Search: {filters.search}
                  <button onClick={() => setFilters({ ...filters, search: '' })}>
                    <X className="w-3 h-3 ml-1 hover:text-blue-900" />
                  </button>
                </span>
              )}
              
              {filters.type !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs">
                  <Tag className="w-3 h-3" />
                  Type: {filters.type}
                  <button onClick={() => setFilters({ ...filters, type: 'all' })}>
                    <X className="w-3 h-3 ml-1 hover:text-green-900" />
                  </button>
                </span>
              )}
              
              {filters.category !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs">
                  <Tag className="w-3 h-3" />
                  Category: {filters.category}
                  <button onClick={() => setFilters({ ...filters, category: 'all' })}>
                    <X className="w-3 h-3 ml-1 hover:text-purple-900" />
                  </button>
                </span>
              )}
            </div>
            
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Filter Info */}
      <div className="mt-3 text-xs text-gray-400 flex items-center gap-4">
        <span>💡 Tip: You can combine multiple filters</span>
        <span>📊 Sorting affects the order</span>
      </div>
    </div>
  );
};

export default TransactionFilters;