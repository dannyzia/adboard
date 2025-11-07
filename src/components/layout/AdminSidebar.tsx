import React from 'react';
import { NavLink } from 'react-router-dom';

export const AdminSidebar: React.FC = () => {
  const navItems: Array<{ path: string; icon: string; label: string }> = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/ads', icon: '📢', label: 'Manage Ads' },
    { path: '/admin/blogs', icon: '📝', label: 'Manage Blogs' },
    { path: '/admin/users', icon: '👥', label: 'Manage Users' },
    { path: '/admin/subscriptions', icon: '💳', label: 'Subscriptions' },
    { path: '/admin/reports', icon: '🚨', label: 'Reports' },
    { path: '/admin/archive', icon: '🗄️', label: 'Archive' },
    { path: '/admin/analytics', icon: '📈', label: 'Analytics' },
    { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0 pt-16">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6 text-blue-400">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <span className="text-xl">🏠</span>
          <span className="font-medium">Back to Site</span>
        </NavLink>
      </div>
    </div>
  );
};
