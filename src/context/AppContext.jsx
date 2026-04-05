import React, { createContext, useContext, useState } from 'react';
import { mockTransactions } from '../data/mockData';
import useLocalStorage from '../hooks/useLocalStorage';

// Create context
const AppContext = createContext(null);

// Create provider component
export function AppProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage('transactions', mockTransactions);
  const [role, setRole] = useLocalStorage('userRole', 'viewer');
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    dateRange: 'all',
    minAmount: '',
    maxAmount: ''
  });
  const [sortBy, setSortBy] = useState('date-desc');

  const addTransaction = (transaction) => {
    if (role !== 'admin') return;
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const editTransaction = (id, updatedTransaction) => {
    if (role !== 'admin') return;
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, ...updatedTransaction, updatedAt: new Date().toISOString() } : t
    ));
  };

  const deleteTransaction = (id) => {
    if (role !== 'admin') return;
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const deleteMultipleTransactions = (ids) => {
    if (role !== 'admin') return;
    setTransactions(transactions.filter(t => !ids.includes(t.id)));
  };

  const getTotalBalance = () => {
    const total = transactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);
    return total;
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    if (filters.search) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(t => new Date(t.date) >= startDate);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(t => new Date(t.date) >= startDate);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(t => new Date(t.date) >= startDate);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          filtered = filtered.filter(t => new Date(t.date) >= startDate);
          break;
        default:
          break;
      }
    }

    if (filters.minAmount) {
      filtered = filtered.filter(t => t.amount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(t => t.amount <= parseFloat(filters.maxAmount));
    }

    switch (sortBy) {
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'amount-asc':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      case 'amount-desc':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'category-asc':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'category-desc':
        filtered.sort((a, b) => b.category.localeCompare(a.category));
        break;
      default:
        break;
    }

    return filtered;
  };

  const getSpendingByCategory = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
  };

  const getIncomeByCategory = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
  };

  const getMonthlyComparison = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthExpenses = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const lastMonthExpenses = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               date.getMonth() === lastMonth && 
               date.getFullYear() === lastMonthYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentMonthIncome = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'income' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastMonthIncome = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'income' && 
               date.getMonth() === lastMonth && 
               date.getFullYear() === lastMonthYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { 
      currentMonthExpenses, 
      lastMonthExpenses,
      currentMonthIncome,
      lastMonthIncome
    };
  };

  const getStatistics = () => {
    const totalIncome = getTotalIncome();
    const totalExpenses = getTotalExpenses();
    const savings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;
    
    const expensesByCategory = getSpendingByCategory();
    const topExpenseCategory = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])[0];
    
    const incomeByCategory = getIncomeByCategory();
    const topIncomeCategory = Object.entries(incomeByCategory)
      .sort((a, b) => b[1] - a[1])[0];
    
    const averageTransaction = transactions.length > 0 
      ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
      : 0;
    
    return {
      totalIncome,
      totalExpenses,
      savings,
      savingsRate,
      topExpenseCategory: topExpenseCategory ? topExpenseCategory[0] : null,
      topExpenseAmount: topExpenseCategory ? topExpenseCategory[1] : 0,
      topIncomeCategory: topIncomeCategory ? topIncomeCategory[0] : null,
      topIncomeAmount: topIncomeCategory ? topIncomeCategory[1] : 0,
      averageTransaction,
      transactionCount: transactions.length
    };
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      dateRange: 'all',
      minAmount: '',
      maxAmount: ''
    });
    setSortBy('date-desc');
  };

  const contextValue = {
    transactions,
    role,
    setRole,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    addTransaction,
    editTransaction,
    deleteTransaction,
    deleteMultipleTransactions,
    getTotalBalance,
    getTotalIncome,
    getTotalExpenses,
    getFilteredTransactions,
    getSpendingByCategory,
    getIncomeByCategory,
    getMonthlyComparison,
    getStatistics,
    clearFilters
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}