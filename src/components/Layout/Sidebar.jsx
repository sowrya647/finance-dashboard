import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Settings as SettingsIcon,
  Shield,
  X,
  ChevronRight,
  BarChart3,
  CreditCard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection }) => {
  const { role } = useApp();

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      id: 'dashboard', 
      section: 'dashboard',
      description: 'Overview & Insights'
    },
    { 
      icon: Wallet, 
      label: 'Transactions', 
      id: 'transactions', 
      section: 'transactions',
      description: 'All transactions'
    },
    { 
      icon: TrendingUp, 
      label: 'Income', 
      id: 'income', 
      section: 'income',
      description: 'Income analytics'
    },
    { 
      icon: TrendingDown, 
      label: 'Expenses', 
      id: 'expenses', 
      section: 'expenses',
      description: 'Expense breakdown'
    },
  ];

  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId);
    
    // Smooth scroll to the section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
    
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
      {/* Logo area */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavigation('dashboard')}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-all duration-300">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FinancePro
            </span>
            <p className="text-xs text-gray-500">Smart Finance Management</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.section)}
            className={`group relative flex flex-col w-full px-4 py-3 rounded-xl transition-all duration-300 ${
              activeSection === item.section
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                : 'text-gray-700 hover:bg-gray-100 hover:transform hover:translate-x-1'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <item.icon className={`w-5 h-5 transition-all duration-300 ${
                  activeSection === item.section 
                    ? 'text-white animate-pulse' 
                    : 'text-gray-500 group-hover:scale-110 group-hover:text-blue-500'
                }`} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {activeSection === item.section && (
                <ChevronRight className="w-4 h-4 text-white animate-pulse" />
              )}
            </div>
            {activeSection === item.section && (
              <p className="text-xs text-white/80 mt-1 ml-8">{item.description}</p>
            )}
          </button>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 m-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Current Role</p>
            <p className="text-sm font-bold text-gray-900 capitalize">{role}</p>
          </div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              role === 'admin' ? 'w-full bg-gradient-to-r from-green-500 to-green-600' : 'w-1/2 bg-gradient-to-r from-blue-500 to-purple-600'
            }`}
          />
        </div>
        <p className="text-xs text-gray-600 mt-3">
          {role === 'admin' 
            ? 'Full access to manage transactions' 
            : 'View-only access'}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-20 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Sticky on desktop */}
      <aside
        className={`
          hidden lg:block lg:sticky lg:top-0 lg:self-start
          w-80 h-screen bg-white shadow-2xl overflow-y-auto
        `}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar - Slide in/out */}
      <aside
        className={`
          fixed top-0 left-0 z-30 w-80 h-full bg-white shadow-2xl
          transform transition-all duration-500 ease-out lg:hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;