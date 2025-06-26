import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  User,
  FileText,
  Calendar,
  MessageSquare,
  BarChart3,
  RefreshCw,
  Send,
  X,
  Building,
  Users,
  Briefcase
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

const api = {
  getAllReports: async () => {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
  },

  getMyReports: async () => {
    const response = await fetch(`${API_BASE_URL}/reports/my-reports`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Failed to fetch my reports');
    return response.json();
  },

  createReport: async (data) => {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create report');
    return response.json();
  },

  updateReportStatus: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/reports/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update report status');
    return response.json();
  },

  deleteReport: async (id) => {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Failed to delete report');
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/reports/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }
};

const ReportsDashboard = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reports, setReports] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    content: '',
    reported_user_id: '',
    report_type: 'other'
  });

  const [updateData, setUpdateData] = useState({
    report_status: '',
    admin_notes: ''
  });

  // User Role Detection
  useEffect(() => {
    const role = localStorage.getItem('user_role') || 'talent';
    setUserRole(role);
    if (role === 'admin') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('my-reports');
    }
  }, []);

  // Load Data
  useEffect(() => {
    loadData();
  }, [activeTab, userRole]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'dashboard' && userRole === 'admin') {
        const [reportsData, statsData, usersData] = await Promise.all([
          api.getAllReports(),
          api.getStats(),
          api.getUsers()
        ]);
        setReports(reportsData.reports || []);
        setStats(statsData.stats || {});
        setUsers(usersData.users || []);
      } else if (activeTab === 'my-reports') {
        const data = await api.getMyReports();
        setMyReports(data.reports || []);
        const usersData = await api.getUsers();
        setUsers(usersData.users || []);
      }
    } catch (err) {
      setError('حدث خطأ في جلب البيانات');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create Report Handler
  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      setError('يرجى كتابة محتوى التقرير');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.createReport(formData);
      setSuccess('تم إرسال التقرير بنجاح');
      setShowCreateModal(false);
      setFormData({ content: '', reported_user_id: '', report_type: 'other' });
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('حدث خطأ في إرسال التقرير');
      console.error('Error creating report:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update Status Handler
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    setLoading(true);
    setError('');
    try {
      await api.updateReportStatus(selectedReport.report_id, updateData);
      setSuccess('تم تحديث حالة التقرير بنجاح');
      setShowUpdateModal(false);
      setUpdateData({ report_status: '', admin_notes: '' });
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('حدث خطأ في تحديث التقرير');
      console.error('Error updating report:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Report Handler
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التقرير؟')) return;

    setLoading(true);
    setError('');
    try {
      await api.deleteReport(reportId);
      setSuccess('تم حذف التقرير بنجاح');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('حدث خطأ في حذف التقرير');
      console.error('Error deleting report:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper Functions
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { bg: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'معلق' },
      'Resolved': { bg: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'محلول' },
      'Rejected': { bg: 'bg-red-100 text-red-800', icon: XCircle, text: 'مرفوض' }
    };
    const config = statusConfig[status] || statusConfig['Pending'];
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getTypeText = (type) => {
    const types = { 'user': 'مستخدم', 'job': 'وظيفة', 'content': 'محتوى', 'other': 'أخرى' };
    return types[type] || type;
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      'user': { bg: 'bg-blue-100 text-blue-800', icon: User },
      'job': { bg: 'bg-purple-100 text-purple-800', icon: Briefcase },
      'content': { bg: 'bg-green-100 text-green-800', icon: FileText },
      'other': { bg: 'bg-gray-100 text-gray-800', icon: AlertTriangle }
    };
    const config = typeConfig[type] || typeConfig['other'];
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {getTypeText(type)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedUser?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatusFilter = filterStatus === 'all' || report.report_status === filterStatus;
    const matchesTypeFilter = filterType === 'all' || report.report_type === filterType;
    return matchesSearch && matchesStatusFilter && matchesTypeFilter;
  });

  const filteredMyReports = myReports.filter(report => {
    const matchesSearch = 
      report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedUser?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatusFilter = filterStatus === 'all' || report.report_status === filterStatus;
    const matchesTypeFilter = filterType === 'all' || report.report_type === filterType;
    return matchesSearch && matchesStatusFilter && matchesTypeFilter;
  });

  const closeModals = () => {
    setShowCreateModal(false);
    setShowDetailsModal(false);
    setShowUpdateModal(false);
    setSelectedReport(null);
    setError('');
  };

  const getUserRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Building className="w-4 h-4" />;
      case 'employer': return <Briefcase className="w-4 h-4" />;
      case 'talent': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getUserRoleText = (role) => {
    switch (role) {
      case 'admin': return 'مدير';
      case 'employer': return 'صاحب عمل';
      case 'talent': return 'موظف';
      default: return 'مستخدم';
    }
  };

  // Render UI
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">نظام إدارة التقارير</h1>
          <p className="text-gray-600">
            {userRole === 'admin' ? 'إدارة ومتابعة جميع التقارير في النظام' : 
             userRole === 'employer' ? 'إدارة تقاريرك كصاحب عمل' : 
             'إدارة تقاريرك كموظف'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button onClick={() => setError('')} className="absolute top-0 left-0 mt-3 ml-3">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{success}</span>
            <button onClick={() => setSuccess('')} className="absolute top-0 left-0 mt-3 ml-3">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {userRole === 'admin' && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline-block ml-2" />
                لوحة التحكم
              </button>
            )}
            <button
              onClick={() => setActiveTab('my-reports')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-reports' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline-block ml-2" />
              {userRole === 'admin' ? 'جميع التقارير' : 'تقاريري'}
            </button>
          </nav>
        </div>

        {/* Dashboard Tab - Admin Only */}
        {activeTab === 'dashboard' && userRole === 'admin' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">إجمالي التقارير</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.total || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">معلقة</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.pending || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">محلولة</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.resolved || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <XCircle className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">مرفوضة</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.rejected || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Calendar className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">هذا الأسبوع</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.recent || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">جميع التقارير</h3>
                  <button
                    onClick={loadData}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                    تحديث
                  </button>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="البحث في التقارير..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="block border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="Pending">معلق</option>
                      <option value="Resolved">محلول</option>
                      <option value="Rejected">مرفوض</option>
                    </select>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="block border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">جميع الأنواع</option>
                      <option value="user">مستخدم</option>
                      <option value="job">وظيفة</option>
                      <option value="content">محتوى</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                </div>
              </div>
              <ul className="divide-y divide-gray-200">
                {loading ? (
                  <li className="px-4 py-8 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">جاري التحميل...</p>
                  </li>
                ) : filteredReports.length === 0 ? (
                  <li className="px-4 py-8 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">لا توجد تقارير</p>
                  </li>
                ) : (
                  filteredReports.map((report) => (
                    <li key={report.report_id} className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              {getStatusBadge(report.report_status)}
                              {getTypeBadge(report.report_type)}
                            </div>
                            <p className="text-sm text-gray-500">{formatDate(report.created_at)}</p>
                          </div>
                          <p className="text-sm text-gray-900 mb-3">{report.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                {getUserRoleIcon(report.reporter?.role)}
                                <span className="mr-1">المبلغ: {report.reporter?.name || 'غير محدد'}</span>
                                <span className="text-xs text-gray-400 mr-1">({getUserRoleText(report.reporter?.role)})</span>
                              </span>
                              {report.reportedUser && (
                                <span className="flex items-center">
                                  <AlertTriangle className="w-4 h-4 ml-1 text-red-500" />
                                  <span className="mr-1">المبلغ عنه: {report.reportedUser.name}</span>
                                  <span className="text-xs text-gray-400 mr-1">({getUserRoleText(report.reportedUser.role)})</span>
                                </span>
                              )}
                            </div>
                          </div>
                          {report.admin_notes && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-md">
                              <p className="text-sm text-blue-800">
                                <strong>ملاحظات الإدارة:</strong> {report.admin_notes}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mr-4">
                          <button
                            onClick={() => { setSelectedReport(report); setShowDetailsModal(true); }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedReport(report);
                              setUpdateData({ report_status: report.report_status, admin_notes: report.admin_notes || '' });
                              setShowUpdateModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="تحديث الحالة"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReport(report.report_id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}

        {/* My Reports Tab */}
        {activeTab === 'my-reports' && (
          <div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {userRole === 'admin' ? 'جميع التقارير' : 'تقاريري'}
                  </h3>
                  <div className="flex space-x-3">
                    <button
                      onClick={loadData}
                      disabled={loading}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                      تحديث
                    </button>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      تقرير جديد
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="البحث في التقارير..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="block border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="Pending">معلق</option>
                      <option value="Resolved">محلول</option>
                      <option value="Rejected">مرفوض</option>
                    </select>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="block border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">جميع الأنواع</option>
                      <option value="user">مستخدم</option>
                      <option value="job">وظيفة</option>
                      <option value="content">محتوى</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                </div>
              </div>
              <ul className="divide-y divide-gray-200">
                {loading ? (
                  <li className="px-4 py-8 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">جاري التحميل...</p>
                  </li>
                ) : filteredMyReports.length === 0 ? (
                  <li className="px-4 py-8 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">لا توجد تقارير</p>
                  </li>
                ) : (
                  filteredMyReports.map((report) => (
                    <li key={report.report_id} className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              {getStatusBadge(report.report_status)}
                              {getTypeBadge(report.report_type)}
                            </div>
                            <p className="text-sm text-gray-500">{formatDate(report.created_at)}</p>
                          </div>
                          <p className="text-sm text-gray-900 mb-3">{report.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              {report.reportedUser && (
                                <span className="flex items-center">
                                  <AlertTriangle className="w-4 h-4 ml-1 text-red-500" />
                                  <span className="mr-1">المبلغ عنه: {report.reportedUser.name}</span>
                                  <span className="text-xs text-gray-400 mr-1">({getUserRoleText(report.reportedUser.role)})</span>
                                </span>
                              )}
                            </div>
                          </div>
                          {report.admin_notes && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-md">
                              <p className="text-sm text-blue-800">
                                <strong>ملاحظات الإدارة:</strong> {report.admin_notes}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mr-4">
                          <button
                            onClick={() => { setSelectedReport(report); setShowDetailsModal(true); }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {userRole === 'admin' && (
                            <button
                              onClick={() => {
                                setSelectedReport(report);
                                setUpdateData({ report_status: report.report_status, admin_notes: report.admin_notes || '' });
                                setShowUpdateModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="تحديث الحالة"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReport(report.report_id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Create Report Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black opacity-50" onClick={closeModals} />
              <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">تقرير جديد</h2>
                  <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleCreateReport}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">نوع التقرير</label>
                      <select
                        value={formData.report_type}
                        onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="user">مستخدم</option>
                        <option value="job">وظيفة</option>
                        <option value="content">محتوى</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>
                    {formData.report_type === 'user' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">المستخدم المبلغ عنه</label>
                        <select
                          value={formData.reported_user_id}
                          onChange={(e) => setFormData({ ...formData, reported_user_id: e.target.value })}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">اختر مستخدم</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.name} ({getUserRoleText(user.role)})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">محتوى التقرير</label>
                      <textarea
                        rows={4}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="اكتب تفاصيل التقرير هنا..."
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'جاري الإرسال...' : 'إرسال التقرير'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Update Status Modal - Admin Only */}
        {showUpdateModal && userRole === 'admin' && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black opacity-50" onClick={closeModals} />
              <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">تحديث حالة التقرير</h2>
                  <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleUpdateStatus}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">حالة التقرير</label>
                      <select
                        value={updateData.report_status}
                        onChange={(e) => setUpdateData({ ...updateData, report_status: e.target.value })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Pending">معلق</option>
                        <option value="Resolved">محلول</option>
                        <option value="Rejected">مرفوض</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات الإدارة</label>
                      <textarea
                        rows={4}
                        value={updateData.admin_notes}
                        onChange={(e) => setUpdateData({ ...updateData, admin_notes: e.target.value })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="اكتب ملاحظاتك هنا..."
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'جاري التحديث...' : 'تحديث الحالة'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Report Details Modal */}
        {showDetailsModal && selectedReport && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black opacity-50" onClick={closeModals} />
              <div className="relative bg-white rounded-lg max-w-3xl w-full p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">تفاصيل التقرير</h2>
                  <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">الحالة</p>
                      <p className="mt-1">{getStatusBadge(selectedReport.report_status)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">نوع التقرير</p>
                      <p className="mt-1">{getTypeBadge(selectedReport.report_type)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">محتوى التقرير</p>
                    <p className="mt-1 text-gray-900">{selectedReport.content}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">المبلغ</p>
                      <div className="mt-1 flex items-center space-x-2">
                        {getUserRoleIcon(selectedReport.reporter?.role)}
                        <span>{selectedReport.reporter?.name || 'غير محدد'}</span>
                        <span className="text-xs text-gray-400">({getUserRoleText(selectedReport.reporter?.role)})</span>
                      </div>
                    </div>
                    {selectedReport.reportedUser && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">المبلغ عنه</p>
                        <div className="mt-1 flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span>{selectedReport.reportedUser.name}</span>
                          <span className="text-xs text-gray-400">({getUserRoleText(selectedReport.reportedUser.role)})</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">تاريخ الإنشاء</p>
                      <p className="mt-1">{formatDate(selectedReport.created_at)}</p>
                    </div>
                    {selectedReport.resolved_at && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">تاريخ الحل</p>
                        <p className="mt-1">{formatDate(selectedReport.resolved_at)}</p>
                      </div>
                    )}
                  </div>
                  {selectedReport.admin_notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">ملاحظات الإدارة</p>
                      <p className="mt-1 text-gray-900">{selectedReport.admin_notes}</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={closeModals}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    إغلاق
                  </button>
                  {userRole === 'admin' && (
                    <button
                      onClick={() => {
                        setUpdateData({ report_status: selectedReport.report_status, admin_notes: selectedReport.admin_notes || '' });
                        setShowDetailsModal(false);
                        setShowUpdateModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      تحديث الحالة
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsDashboard;