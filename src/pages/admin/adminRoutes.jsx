import React from 'react';
import { Route } from 'react-router-dom';
// import AdminLayout from './AdminLayout.jsx';
import Approvals from './Approvals.jsx';
import Posts from './Posts.jsx';
import Users from './Users.jsx';
import Jobs from './Jobs.jsx';
import Reports from './AdminReportPage.jsx';
import AdminSetPricePage from './AdminSetPricePage.jsx';
import AdminSendEmail from './AdminSendEmailPage.jsx';
import AdminTestimonials from './AdminTestimonials.jsx';
const adminRoutes = [
  <Route path="admin/*" >
    <Route path="approvals" element={<Approvals />} />
    <Route path="posts" element={<Posts />} />
    <Route path="users" element={<Users />} />
    <Route path="jobs" element={<Jobs />} />
    <Route path="reports" element={<Reports />} />
    <Route path="set-price" element={<AdminSetPricePage />} />
    <Route path="send-email" element={<AdminSendEmail />} />
    <Route path='testimonials' element={<AdminTestimonials/>} />
  </Route>
];

export default adminRoutes;
