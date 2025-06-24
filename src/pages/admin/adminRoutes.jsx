import React from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from './AdminLayout.jsx';
import Approvals from './Approvals.jsx';
import Posts from './Posts.jsx';
import Users from './Users.jsx';
import Jobs from './Jobs.jsx';
import Reports from './Reports.jsx';
import AdminRoute from '../../components/AdminRoute';

const adminRoutes = (
  <Route 
    path="admin" 
    element={
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    }
  >
    <Route index element={<Approvals />} />
    <Route path="approvals" element={<Approvals />} />
    <Route path="posts" element={<Posts />} />
    <Route path="users" element={<Users />} />
    <Route path="jobs" element={<Jobs />} />
    <Route path="reports" element={<Reports />} />
  </Route>
);

export default adminRoutes;