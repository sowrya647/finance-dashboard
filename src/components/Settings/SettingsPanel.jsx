import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  DollarSign, 
  Download, 
  Shield, 
  Moon, 
  Sun, 
  Globe, 
  Lock, 
  User, 
  Mail, 
  Phone,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SettingsPanel = () => {
  const { role, transactions, clearFilters } = useApp();
  const [activeTab, setActiveTab] = useState('preferences');
  const [savedMessage, setSavedMessage] = useState(null);
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      monthlyReports: true,
      budgetAlerts: true,
      promotionalEmails: false
    },
    preferences: {
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      language: 'English',
      theme: 'light'
    },
    privacy: {
      shareAnalytics: false,
      autoLogout: '30',
      twoFactorAuth: false
    }
  });

  const showSavedMessage = (message) => {
    setSavedMessage(message);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    showSavedMessage('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      const defaultSettings = {
        notifications: {
          emailAlerts: true,
          monthlyReports: true,
          budgetAlerts: true,
          promotionalEmails: false
        },
        preferences: {
          currency: 'USD',
          dateFormat: 'MM/DD/YYYY',
          language: 'English',
          theme: 'light'
        },
        privacy: {
          shareAnalytics: false,
          autoLogout: '30',
          twoFactorAuth: false
        }
      };
      setSettings(defaultSettings);
      localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
      showSavedMessage('Settings reset to default!');
    }
  };

  const exportData = () => {
    const exportData = {
      transactions: transactions,
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_dashboard_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showSavedMessage('Data exported successfully!');
  };

  const clearAllData = () => {
    if (window.confirm('WARNING: This will delete ALL your transaction data. This action cannot be undone. Are you sure?')) {
      localStorage.removeItem('transactions');
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data Management', icon: Download },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
            <p className="text-gray-300">Customize your dashboard experience</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Saved Message Toast */}
      {savedMessage && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {savedMessage}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Currency</h3>
                  <p className="text-sm text-gray-500">Set your preferred currency</p>
                </div>
              </div>
              <select 
                value={settings.preferences.currency}
                onChange={(e) => setSettings({
                  ...settings,
                  preferences: { ...settings.preferences, currency: e.target.value }
                })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Date Format</h3>
                  <p className="text-sm text-gray-500">Choose how dates are displayed</p>
                </div>
              </div>
              <select 
                value={settings.preferences.dateFormat}
                onChange={(e) => setSettings({
                  ...settings,
                  preferences: { ...settings.preferences, dateFormat: e.target.value }
                })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Language</h3>
                  <p className="text-sm text-gray-500">Select your preferred language</p>
                </div>
              </div>
              <select 
                value={settings.preferences.language}
                onChange={(e) => setSettings({
                  ...settings,
                  preferences: { ...settings.preferences, language: e.target.value }
                })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-900">Email Alerts</h3>
                <p className="text-sm text-gray-500">Receive email notifications about your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailAlerts}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailAlerts: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-900">Monthly Reports</h3>
                <p className="text-sm text-gray-500">Get monthly summary reports via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.monthlyReports}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, monthlyReports: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-900">Budget Alerts</h3>
                <p className="text-sm text-gray-500">Get notified when you exceed your budget</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.budgetAlerts}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, budgetAlerts: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* Data Management Tab */}
        {activeTab === 'data' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-900">Export Data</h3>
                <p className="text-sm text-gray-500">Export all your transactions as JSON</p>
              </div>
              <button
                onClick={exportData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-900">Clear All Data</h3>
                <p className="text-sm text-red-500">Warning: This will delete all your transactions</p>
              </div>
              <button
                onClick={clearAllData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear Data
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Data Summary</h3>
                  <p className="text-sm text-gray-500">Overview of your data</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Transactions:</span>
                  <span className="font-semibold">{transactions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Income Entries:</span>
                  <span className="font-semibold text-green-600">{transactions.filter(t => t.type === 'income').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Expense Entries:</span>
                  <span className="font-semibold text-red-600">{transactions.filter(t => t.type === 'expense').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Categories Used:</span>
                  <span className="font-semibold">{new Set(transactions.map(t => t.category)).size}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-900">Share Analytics</h3>
                <p className="text-sm text-gray-500">Help us improve by sharing anonymous usage data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.shareAnalytics}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, shareAnalytics: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-900">Auto Logout</h3>
                <p className="text-sm text-gray-500">Automatically logout after inactivity</p>
              </div>
              <select 
                value={settings.privacy.autoLogout}
                onChange={(e) => setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, autoLogout: e.target.value }
                })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Setup
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSaveSettings}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button
            onClick={handleResetSettings}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;