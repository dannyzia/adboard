import React from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';

export const AdminReportsPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">Reports management interface coming soon...</p>
        </div>
      </div>
    </AdminLayout>
  );
};
