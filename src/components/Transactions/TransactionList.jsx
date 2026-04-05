import React, { useState } from 'react';
import { 
  Edit2, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Tag, 
  DollarSign,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  AlertCircle,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '../../context/AppContext';

const TransactionList = ({ onEdit }) => {
  const { 
    role, 
    getFilteredTransactions, 
    getTransactionsBySelectedMonth, 
    selectedMonthFilter,
    deleteTransaction 
  } = useApp();
  
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  // Use month-filtered transactions if a month is selected
  const transactions = selectedMonthFilter 
    ? getTransactionsBySelectedMonth() 
    : getFilteredTransactions();

  const calculateTotal = (type) => {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const totalIncome = calculateTotal('income');
  const totalExpenses = calculateTotal('expense');
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

  const handleDelete = async (id) => {
    setDeletingId(id);
    setTimeout(() => {
      deleteTransaction(id);
      setDeletingId(null);
      setDeleteConfirm(null);
      if (expandedTransaction === id) {
        setExpandedTransaction(null);
      }
    }, 300);
  };

  const exportData = (formatType) => {
    const data = transactions.map(t => ({
      Date: format(new Date(t.date), 'yyyy-MM-dd'),
      Description: t.description,
      Category: t.category,
      Amount: t.amount,
      Type: t.type
    }));

    if (formatType === 'csv') {
      const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
      const csvContent = [
        headers.join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (formatType === 'json') {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${format(new Date(), 'yyyy-MM-dd')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setShowExportMenu(false);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4 shadow-inner">
          <DollarSign className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg font-medium">
          {selectedMonthFilter 
            ? `No transactions found for ${selectedMonthFilter.month} ${selectedMonthFilter.year}`
            : 'No transactions found'}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          {selectedMonthFilter 
            ? 'Try selecting a different month or clear the filter'
            : 'Add your first transaction to get started'}
        </p>
        {role === 'admin' && !selectedMonthFilter && (
          <button
            onClick={() => onEdit(null)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <DollarSign className="w-4 h-4" />
            Add Transaction
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Month Filter Indicator */}
      {selectedMonthFilter && (
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700">
              Showing transactions for: <strong>{selectedMonthFilter.month} {selectedMonthFilter.year}</strong>
            </span>
            <span className="text-xs text-blue-500">
              ({transactions.length} transactions)
            </span>
          </div>
        </div>
      )}

      {/* Stats Summary with Savings Rate */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Income</p>
              <p className="text-2xl font-bold text-green-700">
                ${totalIncome.toLocaleString()}
              </p>
              <p className="text-xs text-green-500 mt-1">
                {selectedMonthFilter ? 'This month' : 'All time'}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-red-700">
                ${totalExpenses.toLocaleString()}
              </p>
              <p className="text-xs text-red-500 mt-1">
                {selectedMonthFilter ? 'This month' : 'All time'}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shadow-lg">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className={`bg-gradient-to-br rounded-xl p-4 border hover:shadow-md transition-shadow ${
          savings >= 0 
            ? 'from-blue-50 to-indigo-50 border-blue-100' 
            : 'from-yellow-50 to-orange-50 border-yellow-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${savings >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                Net Savings
              </p>
              <p className={`text-2xl font-bold ${savings >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                {savings >= 0 ? '+' : '-'}${Math.abs(savings).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Savings rate: {savingsRate}%
              </p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${
              savings >= 0 
                ? 'bg-blue-500' 
                : 'bg-orange-500'
            }`}>
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>


      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl transform animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Transaction</h3>
                <p className="text-sm text-gray-500">Are you sure you want to delete this transaction?</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 pl-4 border-l-4 border-red-500">
              {deleteConfirm.description} - ${deleteConfirm.amount.toLocaleString()}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                disabled={deletingId === deleteConfirm.id}
              >
                {deletingId === deleteConfirm.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Date
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Tag className="w-3 h-3" />
                  Category
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3 h-3" />
                  Amount
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
              {role === 'admin' && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {transactions.map((transaction, index) => (
              <tr 
                key={transaction.id} 
                className={`hover:bg-gray-50 transition-all duration-200 group animate-fade-in ${
                  deletingId === transaction.id ? 'opacity-50 pointer-events-none' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-xs text-gray-400">
                    {format(new Date(transaction.date), 'hh:mm a')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {transaction.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </td>
                {role === 'admin' && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                        title="Edit transaction"
                        disabled={deletingId === transaction.id}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({
                          id: transaction.id,
                          description: transaction.description,
                          amount: transaction.amount
                        })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                        title="Delete transaction"
                        disabled={deletingId === transaction.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {transactions.map((transaction, index) => (
          <div 
            key={transaction.id}
            className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 animate-fade-in ${
              deletingId === transaction.id ? 'opacity-50 pointer-events-none' : ''
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-lg">
                  {transaction.description}
                </h4>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {transaction.type}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xl font-bold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 mt-1">
                  <Tag className="w-3 h-3 mr-1" />
                  {transaction.category}
                </span>
              </div>
            </div>
            
            {/* Expand/Collapse for More Details */}
            <button
              onClick={() => setExpandedTransaction(expandedTransaction === transaction.id ? null : transaction.id)}
              className="w-full flex items-center justify-center gap-1 text-xs text-gray-500 py-1 hover:text-gray-700"
            >
              {expandedTransaction === transaction.id ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  Show details
                </>
              )}
            </button>
            
            {expandedTransaction === transaction.id && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="text-gray-700 font-mono text-xs">{transaction.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Full Date:</span>
                  <span className="text-gray-700">{format(new Date(transaction.date), 'EEEE, MMMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Time:</span>
                  <span className="text-gray-700">{format(new Date(transaction.date), 'hh:mm:ss a')}</span>
                </div>
              </div>
            )}
            
            {role === 'admin' && (
              <div className="flex gap-2 pt-3 border-t border-gray-100 mt-2">
                <button
                  onClick={() => onEdit(transaction)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm({
                    id: transaction.id,
                    description: transaction.description,
                    amount: transaction.amount
                  })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;