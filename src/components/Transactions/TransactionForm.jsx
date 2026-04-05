import React, { useState, useEffect } from 'react';
import { X, Plus, TrendingUp, TrendingDown, DollarSign, Tag, Calendar, Save, ArrowRight } from 'lucide-react';
import { categories } from '../../data/mockData';

const TransactionForm = ({ transaction, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amountPreview, setAmountPreview] = useState('');

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type
      });
      setAmountPreview(`$${transaction.amount.toLocaleString()}`);
    }
  }, [transaction]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, amount: value });
    if (value && !isNaN(value)) {
      setAmountPreview(`$${parseFloat(value).toLocaleString()}`);
    } else {
      setAmountPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    setIsSubmitting(false);
    onClose();
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Food': '🍔',
      'Salary': '💰',
      'Freelance': '💻',
      'Investment': '📈',
      'Entertainment': '🎬',
      'Utilities': '💡',
      'Health': '🏥'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 animate-slide-up">
        {/* Header with gradient */}
        <div className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r ${formData.type === 'income' ? 'from-green-500 to-emerald-600' : 'from-red-500 to-orange-600'} opacity-10`}></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full transform -translate-x-12 translate-y-12"></div>
          
          <div className="flex justify-between items-center p-6 border-b border-gray-100 relative">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${formData.type === 'income' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-orange-500'} flex items-center justify-center shadow-lg`}>
                {formData.type === 'income' ? (
                  <TrendingUp className="w-5 h-5 text-white" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {transaction ? 'Edit Transaction' : 'Add New Transaction'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {transaction ? 'Update your financial record' : 'Record a new financial activity'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Description Field */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-500" />
              Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Grocery Shopping, Salary, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            />
          </div>
          
          {/* Amount Field with Preview */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-500" />
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                required
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleAmountChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none pr-24"
              />
              {amountPreview && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${formData.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {amountPreview}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Category Field with Icons */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none cursor-pointer"
            >
              {categories.filter(c => c !== 'All').map(category => (
                <option key={category} value={category} className="py-2">
                  {getCategoryIcon(category)} {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Type Toggle */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transaction Type
            </label>
            <div className="flex gap-3 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-200 ${
                  formData.type === 'expense'
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                <span className="font-medium">Expense</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-200 ${
                  formData.type === 'income'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Income</span>
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 relative overflow-hidden bg-gradient-to-r ${
                formData.type === 'income' 
                  ? 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                  : 'from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
              } text-white py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{transaction ? 'Update Transaction' : 'Add Transaction'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
        
        {/* Footer Note */}
        <div className="px-6 pb-6">
          <p className="text-xs text-center text-gray-400">
            {formData.type === 'income' 
              ? '✨ Adding income will increase your total balance' 
              : '⚠️ Adding expense will decrease your total balance'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;