import React, { useState } from 'react';
import { Menu, Bell, User, Settings, LogOut, ChevronDown, CreditCard, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { role } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all duration-300 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <button className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all duration-300">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-fade-in">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">John Doe</p>
                        <p className="text-xs text-gray-500">john@example.com</p>
                        <p className="text-xs text-blue-600 mt-1 capitalize font-medium">{role}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;