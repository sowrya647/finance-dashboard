import React, { createContext, useContext, useState } from "react";
import { mockTransactions } from "../data/mockData";
import useLocalStorage from "../hooks/useLocalStorage";

// Create context
const AppContext = createContext(null);

// Create provider component
export function AppProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage(
    "transactions",
    mockTransactions,
  );
  const [role, setRole] = useLocalStorage("userRole", "viewer");
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
    dateRange: "all",
    minAmount: "",
    maxAmount: "",
  });
  const [sortBy, setSortBy] = useState("date-desc");

  // Add selectedMonth state
  const [selectedMonth, setSelectedMonth] = useState(null);

  const addTransaction = (transaction) => {
    if (role !== "admin") return;
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const editTransaction = (id, updatedTransaction) => {
    if (role !== "admin") return;
    setTransactions(
      transactions.map((t) =>
        t.id === id
          ? { ...t, ...updatedTransaction, updatedAt: new Date().toISOString() }
          : t,
      ),
    );
  };

  const deleteTransaction = (id) => {
    if (role !== "admin") return;
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const deleteMultipleTransactions = (ids) => {
    if (role !== "admin") return;
    setTransactions(transactions.filter((t) => !ids.includes(t.id)));
  };

  const getTotalBalance = () => {
    const total = transactions.reduce((acc, t) => {
      return t.type === "income" ? acc + t.amount : acc - t.amount;
    }, 0);
    return total;
  };

  const getTotalIncome = () => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    if (filters.search) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    if (filters.type !== "all") {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    if (filters.category !== "all") {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    if (filters.dateRange !== "all") {
      const now = new Date();
      const startDate = new Date();

      switch (filters.dateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter((t) => new Date(t.date) >= startDate);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          filtered = filtered.filter((t) => new Date(t.date) >= startDate);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter((t) => new Date(t.date) >= startDate);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          filtered = filtered.filter((t) => new Date(t.date) >= startDate);
          break;
        default:
          break;
      }
    }

    if (filters.minAmount) {
      filtered = filtered.filter(
        (t) => t.amount >= parseFloat(filters.minAmount),
      );
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(
        (t) => t.amount <= parseFloat(filters.maxAmount),
      );
    }

    switch (sortBy) {
      case "date-asc":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "date-desc":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "amount-asc":
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      case "amount-desc":
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case "category-asc":
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "category-desc":
        filtered.sort((a, b) => b.category.localeCompare(a.category));
        break;
      default:
        break;
    }

    return filtered;
  };

  const getSpendingByCategory = () => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
  };

  const getIncomeByCategory = () => {
    return transactions
      .filter((t) => t.type === "income")
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
      .filter((t) => {
        const date = new Date(t.date);
        return (
          t.type === "expense" &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const lastMonthExpenses = transactions
      .filter((t) => {
        const date = new Date(t.date);
        return (
          t.type === "expense" &&
          date.getMonth() === lastMonth &&
          date.getFullYear() === lastMonthYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const currentMonthIncome = transactions
      .filter((t) => {
        const date = new Date(t.date);
        return (
          t.type === "income" &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthIncome = transactions
      .filter((t) => {
        const date = new Date(t.date);
        return (
          t.type === "income" &&
          date.getMonth() === lastMonth &&
          date.getFullYear() === lastMonthYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      currentMonthExpenses,
      lastMonthExpenses,
      currentMonthIncome,
      lastMonthIncome,
    };
  };

  const getStatistics = () => {
    const totalIncome = getTotalIncome();
    const totalExpenses = getTotalExpenses();
    const savings = totalIncome - totalExpenses;
    const savingsRate =
      totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

    const expensesByCategory = getSpendingByCategory();
    const topExpenseCategory = Object.entries(expensesByCategory).sort(
      (a, b) => b[1] - a[1],
    )[0];

    const incomeByCategory = getIncomeByCategory();
    const topIncomeCategory = Object.entries(incomeByCategory).sort(
      (a, b) => b[1] - a[1],
    )[0];

    const averageTransaction =
      transactions.length > 0
        ? transactions.reduce((sum, t) => sum + t.amount, 0) /
          transactions.length
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
      transactionCount: transactions.length,
    };
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "all",
      category: "all",
      dateRange: "all",
      minAmount: "",
      maxAmount: "",
    });
    setSortBy("date-desc");
  };

  const getMonthlyTransactions = () => {
    const monthlyData = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          month: monthYear,
          monthName: date.toLocaleString("default", { month: "long" }),
          year: date.getFullYear(),
          income: 0,
          expenses: 0,
          transactions: [],
        };
      }

      if (transaction.type === "income") {
        monthlyData[monthYear].income += transaction.amount;
      } else {
        monthlyData[monthYear].expenses += transaction.amount;
      }

      monthlyData[monthYear].transactions.push(transaction);
    });

    return Object.values(monthlyData).sort((a, b) =>
      b.month.localeCompare(a.month),
    );
  };

  const getMonthlySummary = () => {
    const monthlyData = getMonthlyTransactions();

    return monthlyData.map((month) => ({
      month: month.monthName,
      year: month.year,
      monthKey: month.month,
      income: month.income,
      expenses: month.expenses,
      savings: month.income - month.expenses,
      savingsRate:
        month.income > 0
          ? (((month.income - month.expenses) / month.income) * 100).toFixed(1)
          : 0,
      transactionCount: month.transactions.length,
    }));
  };

  const getCurrentMonthData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: now.toLocaleString("default", { month: "long" }),
      year: currentYear,
      income,
      expenses,
      savings: income - expenses,
      transactionCount: monthTransactions.length,
      transactions: monthTransactions,
    };
  };

  const getPreviousMonthData = () => {
    const now = new Date();
    const previousMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const previousYear =
      now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    const monthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === previousMonth && date.getFullYear() === previousYear
      );
    });

    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: new Date(previousYear, previousMonth).toLocaleString("default", {
        month: "long",
      }),
      year: previousYear,
      income,
      expenses,
      savings: income - expenses,
      transactionCount: monthTransactions.length,
    };
  };

  const getYearlySummary = () => {
    const yearlyData = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const year = date.getFullYear();

      if (!yearlyData[year]) {
        yearlyData[year] = {
          year: year,
          income: 0,
          expenses: 0,
          months: {},
        };
      }

      const month = date.toLocaleString("default", { month: "long" });
      if (!yearlyData[year].months[month]) {
        yearlyData[year].months[month] = { income: 0, expenses: 0 };
      }

      if (transaction.type === "income") {
        yearlyData[year].income += transaction.amount;
        yearlyData[year].months[month].income += transaction.amount;
      } else {
        yearlyData[year].expenses += transaction.amount;
        yearlyData[year].months[month].expenses += transaction.amount;
      }
    });

    return Object.values(yearlyData).sort((a, b) => b.year - a.year);
  };

  const getMonthOverMonthGrowth = () => {
    const monthlySummary = getMonthlySummary();

    if (monthlySummary.length < 2) {
      return { growth: 0, trend: "stable" };
    }

    const latestMonth = monthlySummary[0];
    const previousMonth = monthlySummary[1];

    const growth = (
      ((latestMonth.savings - previousMonth.savings) /
        Math.abs(previousMonth.savings)) *
      100
    ).toFixed(1);
    const trend = growth > 0 ? "positive" : growth < 0 ? "negative" : "stable";

    return {
      growth: Math.abs(growth),
      trend,
      latestMonth: latestMonth.month,
      previousMonth: previousMonth.month,
    };
  };

  // Month filter functions (defined once)
  const getTransactionsByMonth = (year, monthName) => {
    const monthIndex = new Date(
      Date.parse(monthName + " 1, " + year),
    ).getMonth();
    return transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === monthIndex && date.getFullYear() === parseInt(year)
      );
    });
  };

  const getSpendingByCategoryForMonth = (year, monthName) => {
    const monthTransactions = getTransactionsByMonth(year, monthName);
    return monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
  };

  const getIncomeByCategoryForMonth = (year, monthName) => {
    const monthTransactions = getTransactionsByMonth(year, monthName);
    return monthTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
  };

  const getMonthSummary = (year, monthName) => {
    const monthTransactions = getTransactionsByMonth(year, monthName);
    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expenses,
      savings: income - expenses,
      savingsRate:
        income > 0 ? (((income - expenses) / income) * 100).toFixed(1) : 0,
      transactionCount: monthTransactions.length,
    };
  };
  // Add this with your other state declarations (around line 20)
  const [selectedMonthFilter, setSelectedMonthFilter] = useState(null);

  // Add this function after your existing functions (around line 350)
  const getTransactionsBySelectedMonth = () => {
    if (!selectedMonthFilter) {
      return getFilteredTransactions();
    }

    const { month, year } = selectedMonthFilter;
    const monthIndex = new Date(Date.parse(month + " 1, " + year)).getMonth();

    // First filter by selected month
    let filtered = transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === monthIndex && date.getFullYear() === parseInt(year)
      );
    });

    // Then apply existing filters
    if (filters.search) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    if (filters.type !== "all") {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    if (filters.category !== "all") {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    if (filters.dateRange !== "all") {
      const now = new Date();
      const startDate = new Date();

      switch (filters.dateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter((t) => new Date(t.date) >= startDate);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          filtered = filtered.filter((t) => new Date(t.date) >= startDate);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter((t) => new Date(t.date) >= startDate);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          filtered = filtered.filter((t) => new Date(t.date) >= startDate);
          break;
        default:
          break;
      }
    }

    if (filters.minAmount) {
      filtered = filtered.filter(
        (t) => t.amount >= parseFloat(filters.minAmount),
      );
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(
        (t) => t.amount <= parseFloat(filters.maxAmount),
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "date-asc":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "date-desc":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "amount-asc":
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      case "amount-desc":
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case "category-asc":
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "category-desc":
        filtered.sort((a, b) => b.category.localeCompare(a.category));
        break;
      default:
        break;
    }

    return filtered;
  };

  // Add a function to clear all month filters
  const clearMonthFilters = () => {
    setSelectedMonth(null);
    setSelectedMonthFilter(null);
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
    clearFilters,
    getMonthlyTransactions,
    getMonthlySummary,
    getCurrentMonthData,
    getPreviousMonthData,
    getYearlySummary,
    getMonthOverMonthGrowth,
    selectedMonth,
    setSelectedMonth,
    selectedMonthFilter, // NEW
    setSelectedMonthFilter, // NEW
    getTransactionsBySelectedMonth, // NEW
    clearMonthFilters, // NEW
    getTransactionsByMonth,
    getSpendingByCategoryForMonth,
    getIncomeByCategoryForMonth,
    getMonthSummary,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
