import React, { useState, useEffect } from "react";
import {
  Plus,
  Sparkles,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  Filter,
  Calendar,
  Download,
  BarChart3, // Add this import
  Wallet,
  Settings,
  LogOut,
  Menu,
  Bell,
  User,
  ChevronDown,
  Shield,
  X,
  ChevronRight,
  Activity,
  Award,
  Zap,
  Eye,
  Edit2,
  Trash2,
  DollarSign,
  Tag,
} from "lucide-react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import SummaryCards from "./components/Dashboard/SummaryCards";
import BalanceTrend from "./components/Dashboard/BalanceTrend";
import SpendingBreakdown from "./components/Dashboard/SpendingBreakdown";
import TransactionList from "./components/Transactions/TransactionList";
import TransactionFilters from "./components/Transactions/TransactionFilters";
import TransactionForm from "./components/Transactions/TransactionForm";
import InsightsSection from "./components/Insights/InsightsSection";
import RoleSwitcher from "./components/Common/RoleSwitcher";

const DashboardContent = () => {
  const {
    role,
    addTransaction,
    editTransaction,
    getTotalIncome,
    getTotalExpenses,
    getSpendingByCategory,
  } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Handle scroll spy - update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "dashboard",
        "transactions",
        "income",
        "expenses",
        "analytics",
        "settings",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddClick = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFormSubmit = (transactionData) => {
    if (editingTransaction) {
      editTransaction(editingTransaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
    setShowForm(false);
    setEditingTransaction(null);
  };

  // Get spending data for display
  const spendingData = getSpendingByCategory();
  const topCategories = Object.entries(spendingData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Dashboard Section */}
            <section id="dashboard" className="scroll-mt-20">
              {/* Welcome Banner */}
              <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                      Welcome John!
                      <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                    </h1>
                    <p className="text-blue-100">
                      Here's your financial overview for today
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <p className="text-sm">Current Period</p>
                      <p className="font-semibold">March 2024</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Switcher */}
              <div className="mb-8 transform hover:scale-[1.02] transition-transform duration-300">
                <RoleSwitcher />
              </div>

              {/* Summary Cards */}
              <div className="mb-8">
                <SummaryCards />
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="transform hover:scale-[1.02] transition-all duration-300">
                  <BalanceTrend />
                </div>
                <div className="transform hover:scale-[1.02] transition-all duration-300">
                  <SpendingBreakdown />
                </div>
              </div>

              {/* Insights Section */}
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20"></div>
                <div className="relative">
                  <InsightsSection />
                </div>
              </div>
            </section>

            {/* Transactions Section */}
            <section id="transactions" className="scroll-mt-20">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Transactions
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage and track all your financial activities
                      </p>
                    </div>
                    {role === "admin" && (
                      <button
                        onClick={handleAddClick}
                        className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        <span>Add Transaction</span>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </button>
                    )}
                  </div>
                </div>
                <TransactionFilters />
                <TransactionList onEdit={handleEdit} />
              </div>
            </section>

            {/* Income Section */}
            <section id="income" className="scroll-mt-20 mt-12">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Income Overview
                      </h2>
                      <p className="text-green-100">
                        Track and analyze your income streams
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Total Income</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${getTotalIncome().toLocaleString()}
                      </p>
                      <p className="text-xs text-green-500 mt-2">
                        +12.5% from last month
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">
                        Average Monthly
                      </p>
                      <p className="text-2xl font-bold text-blue-600">$5,200</p>
                      <p className="text-xs text-blue-500 mt-2">
                        Consistent growth
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Top Source</p>
                      <p className="text-2xl font-bold text-purple-600">
                        Salary
                      </p>
                      <p className="text-xs text-purple-500 mt-2">
                        73% of total
                      </p>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-4">
                    Income Breakdown
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        source: "Salary",
                        amount: 5000,
                        percentage: 73,
                        color: "bg-green-500",
                      },
                      {
                        source: "Freelance",
                        amount: 1200,
                        percentage: 17,
                        color: "bg-blue-500",
                      },
                      {
                        source: "Investments",
                        amount: 680,
                        percentage: 10,
                        color: "bg-purple-500",
                      },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{item.source}</span>
                          <span className="font-semibold text-gray-900">
                            ${item.amount}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Expenses Section with Pie Chart */}
            <section id="expenses" className="scroll-mt-20 mt-12">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Expense Analysis
                      </h2>
                      <p className="text-red-100">
                        Detailed breakdown of your spending
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <PieChartIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Expense Summary */}
                    <div>
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-1">
                          Total Expenses
                        </p>
                        <p className="text-2xl font-bold text-red-600">
                          ${getTotalExpenses().toLocaleString()}
                        </p>
                        <p className="text-xs text-red-500 mt-2">
                          -3.1% from last month
                        </p>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-4">
                        Top Spending Categories
                      </h3>
                      <div className="space-y-3">
                        {(() => {
                          const spendingData = getSpendingByCategory();
                          // Convert to array and sort safely
                          const categoriesArray = Object.entries(
                            spendingData || {},
                          );
                          const topCategories = categoriesArray
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5);

                          const total = getTotalExpenses();

                          if (topCategories.length === 0) {
                            return (
                              <div className="text-center py-8 text-gray-500">
                                No expense data available
                              </div>
                            );
                          }

                          const colors = [
                            "bg-red-500",
                            "bg-orange-500",
                            "bg-yellow-500",
                            "bg-pink-500",
                            "bg-purple-500",
                          ];

                          return topCategories.map(
                            ([category, amount], idx) => {
                              const percentage =
                                total > 0
                                  ? ((amount / total) * 100).toFixed(1)
                                  : 0;
                              return (
                                <div key={idx}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700">
                                      {category}
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                      ${amount.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${colors[idx % colors.length]} rounded-full transition-all duration-500`}
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {percentage}% of total expenses
                                  </p>
                                </div>
                              );
                            },
                          );
                        })()}
                      </div>
                    </div>

                    {/* Expense Pie Chart Visualization */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4 text-center">
                        Expense Distribution
                      </h3>
                      <div className="relative w-64 h-64 mx-auto">
                        <svg
                          viewBox="0 0 100 100"
                          className="transform -rotate-90"
                        >
                          {(() => {
                            const spendingData = getSpendingByCategory();
                            const categoriesArray = Object.entries(
                              spendingData || {},
                            );
                            const total = getTotalExpenses();

                            if (categoriesArray.length === 0 || total === 0) {
                              return (
                                <text
                                  x="50"
                                  y="50"
                                  textAnchor="middle"
                                  fill="#9ca3af"
                                  fontSize="12"
                                  transform="rotate(90 50 50)"
                                >
                                  No data
                                </text>
                              );
                            }

                            const colors = [
                              "#ef4444",
                              "#f97316",
                              "#eab308",
                              "#ec489a",
                              "#a855f7",
                              "#06b6d4",
                              "#8b5cf6",
                              "#10b981",
                            ];
                            let accumulatedPercentage = 0;

                            return categoriesArray
                              .slice(0, 8)
                              .map(([category, amount], index) => {
                                const percentage = (amount / total) * 100;
                                const startAngle =
                                  (accumulatedPercentage / 100) * 360;
                                const endAngle =
                                  startAngle + (percentage / 100) * 360;
                                accumulatedPercentage += percentage;

                                const startRad = (startAngle * Math.PI) / 180;
                                const endRad = (endAngle * Math.PI) / 180;

                                const x1 = 50 + 40 * Math.cos(startRad);
                                const y1 = 50 + 40 * Math.sin(startRad);
                                const x2 = 50 + 40 * Math.cos(endRad);
                                const y2 = 50 + 40 * Math.sin(endRad);

                                const largeArc = percentage > 50 ? 1 : 0;

                                return (
                                  <path
                                    key={index}
                                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                    fill={colors[index % colors.length]}
                                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                  >
                                    <title>{`${category}: $${amount} (${percentage.toFixed(1)}%)`}</title>
                                  </path>
                                );
                              });
                          })()}
                          <circle cx="50" cy="50" r="25" fill="white" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="text-xl font-bold text-gray-900">
                              ${getTotalExpenses().toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-6">
                        {(() => {
                          const spendingData = getSpendingByCategory();
                          const categoriesArray = Object.entries(
                            spendingData || {},
                          );
                          const total = getTotalExpenses();
                          const colors = [
                            "#ef4444",
                            "#f97316",
                            "#eab308",
                            "#ec489a",
                            "#a855f7",
                            "#06b6d4",
                            "#8b5cf6",
                            "#10b981",
                          ];

                          if (categoriesArray.length === 0) {
                            return (
                              <div className="text-center col-span-2 text-gray-500">
                                No expense data
                              </div>
                            );
                          }

                          return categoriesArray
                            .slice(0, 8)
                            .map(([category, amount], idx) => {
                              const percentage =
                                total > 0
                                  ? ((amount / total) * 100).toFixed(1)
                                  : 0;
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 text-xs"
                                >
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                      backgroundColor:
                                        colors[idx % colors.length],
                                    }}
                                  ></div>
                                  <span className="text-gray-600">
                                    {category}
                                  </span>
                                  <span className="font-semibold text-gray-900 ml-auto">
                                    {percentage}%
                                  </span>
                                </div>
                              );
                            });
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Transaction Form Modal */}
            {showForm && (
              <TransactionForm
                transaction={editingTransaction}
                onSubmit={handleFormSubmit}
                onClose={() => {
                  setShowForm(false);
                  setEditingTransaction(null);
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}

export default App;
