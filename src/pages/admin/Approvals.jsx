import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Approvals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem('access-token');
      const response = await axios.get('http://127.0.0.1:8000/api/itian-registration-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch ITIAN registration requests:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: 'Approve Request?',
      text: 'Are you sure you want to approve this ITIAN registration request?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#e35d5b',
      confirmButtonText: 'Yes, approve',
    });
    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const token = localStorage.getItem('access-token');
        await axios.put(`http://localhost:8000/api/itian-registration-requests/${id}/review`, {
          status: 'Approved',
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Approved!', 'The request has been approved.', 'success');
        fetchRequests();
      } catch (error) {
        console.error('Failed to approve request:', error);
        Swal.fire('Error!', 'Failed to approve the request. Please try again.', 'error');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: 'Reject Request?',
      text: 'Are you sure you want to reject this ITIAN registration request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e35d5b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, reject',
    });
    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const token = localStorage.getItem('access-token');
        await axios.put(`http://localhost:8000/api/itian-registration-requests/${id}/review`, {
          status: 'Rejected',
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Rejected!', 'The request has been rejected.', 'success');
        fetchRequests();
      } catch (error) {
        console.error('Failed to reject request:', error);
        Swal.fire('Error!', 'Failed to reject the request. Please try again.', 'error');
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Approvals</h1>
      <p className="mb-4">Approve ITIANs and Employers requests to join the platform.</p>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Certificate</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{req.user?.name}</td>
                  <td className="py-2 px-4">{req.user?.email}</td>
                  <td className="py-2 px-4">{req.status}</td>
                  <td className="py-2 px-4">
                    <a
                      href={`http://127.0.0.1:8000/storage/${req.certificate}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Certificate
                    </a>
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                      onClick={() => handleApprove(req.id)}
                      disabled={req.status.toLowerCase() === 'approved'}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      onClick={() => handleReject(req.id)}
                      disabled={req.status.toLowerCase() === 'rejected'}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-red-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-red-600 font-semibold">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;
