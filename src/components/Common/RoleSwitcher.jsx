import React from 'react';
import { Shield, Eye, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const RoleSwitcher = () => {
  const { role, setRole } = useApp();

  const roles = [
    { id: 'viewer', name: 'Viewer', icon: Eye, description: 'View only access' },
    { id: 'admin', name: 'Admin', icon: Settings, description: 'Full access to edit' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Shield className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900">User Role</h3>
      </div>
      <div className="flex gap-2">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            className={`flex-1 px-4 py-2 rounded-lg transition-all ${
              role === r.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <r.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{r.name}</span>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {role === 'admin' 
          ? 'Admin mode: You can add, edit, and delete transactions' 
          : 'Viewer mode: You can only view transactions'}
      </p>
    </div>
  );
};

export default RoleSwitcher;