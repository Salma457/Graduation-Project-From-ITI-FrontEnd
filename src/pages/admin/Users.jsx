import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../store/usersSlice';
import Pagination from '../../components/Pagination';
import LoaderOverlay from '../../components/LoaderOverlay';

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.users.loading);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    dispatch(fetchUsers()).then((result) => {
      // Log the result of the fetchUsers thunk
      console.log('fetchUsers result:', result);
    });
  }, [dispatch]);

  useEffect(() => {
    console.log('Users from store:', users);
  }, [users]);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  // Compute filtered users (robust against null/undefined)
  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    const name = (user.name || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter === '' ? true : (statusFilter === 'active' ? user.is_active : !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  }) : [];

  // Count admins for delete logic
  const adminCount = Array.isArray(users) ? users.filter(u => u.role === 'admin').length : 0;

  // Delete handler (UI only, no API call yet)
  const handleDelete = (user) => {
    if (user.role === 'admin' && adminCount === 1) {
      alert('You cannot delete the last admin user.');
      return;
    }
    // TODO: Add delete API call and confirmation
    alert(`Delete user: ${user.name}`);
  };

  // Paginate filtered users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-6">
      {loading && <LoaderOverlay text="Loading users..." />}
      {!loading && (
        <>
          <h1 className="text-2xl font-bold mb-2">Users</h1>
          <p className="mb-4">Show and delete users.</p>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Sidebar Filters */}
            <div className="md:w-1/5 w-full bg-white rounded-lg shadow p-4 flex flex-col gap-4 border border-gray-200">
              <div>
                <label className="block text-sm font-semibold mb-2 text-red-700">Role</label>
                <select
                  className="border-2 border-red-400 focus:border-red-600 rounded px-3 py-2 w-full shadow-sm focus:outline-none transition bg-white text-gray-700"
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="itian">ITIAN</option>
                  <option value="employer">Employer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-red-700">Status</label>
                <select
                  className="border-2 border-red-400 focus:border-red-600 rounded px-3 py-2 w-full shadow-sm focus:outline-none transition bg-white text-gray-700"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="border-2 border-red-400 focus:border-red-600 rounded px-3 py-2 w-full md:w-1/3 shadow-sm focus:outline-none transition"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
                  <div key={user.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border border-gray-200 hover:shadow-2xl transition-all duration-200 group">
                    <img
                      src={user.profile_picture ? `http://127.0.0.1:8000/storage/${user.profile_picture}` : '/default-avatar.png'}
                      alt="avatar"
                      className="w-20 h-20 rounded-full object-cover border-2 border-red-400 mb-3 group-hover:scale-105 transition-transform duration-200"
                      onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                    />
                    <h2 className="text-lg font-bold text-red-700 mb-1 group-hover:text-red-800">{user.name}</h2>
                    <p className="text-gray-600 mb-1 text-sm">{user.email}</p>
                    <p className="text-gray-500 mb-1 capitalize text-xs">Role: <span className="font-semibold">{user.role}</span></p>
                    <span className={`px-2 py-1 rounded text-xs font-semibold mb-1 ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{user.is_active ? 'Active' : 'Inactive'}</span>
                    <p className="text-gray-400 text-xs mb-2">Last login: {user.last_login ? new Date(user.last_login).toLocaleString() : '-'}</p>
                    <div className="flex gap-2 mt-2 w-full">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition w-full text-xs font-semibold">View</button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition w-full text-xs font-semibold disabled:opacity-60"
                        onClick={() => handleDelete(user)}
                        disabled={user.role === 'admin' && adminCount === 1}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-8 text-gray-500">No users found.</div>
                )}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
