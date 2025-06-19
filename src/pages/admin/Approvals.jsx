import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Approvals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [imageModal, setImageModal] = useState({ open: false, src: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

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

  // Calculate paginated requests
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const paginatedRequests = requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handle page change
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
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
              {paginatedRequests.map((req) => (
                <tr key={req.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{req.user?.name}</td>
                  <td className="py-2 px-4">{req.user?.email}</td>
                  <td className="py-2 px-4">{req.status}</td>
                  <td className="py-2 px-4">
                    {req.certificate && (req.certificate.toLowerCase().endsWith('.pdf') ? (
                      <a
                        href={`http://127.0.0.1:8000/storage/${req.certificate}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Certificate 
                      </a>
                    ) : (
                      <button
                        className="text-blue-600 underline cursor-pointer bg-transparent border-none p-0"
                        onClick={() => setImageModal({ open: true, src: `http://127.0.0.1:8000/storage/${req.certificate}` })}
                      >
                        View Certificate
                      </button>
                    ))}
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
              {paginatedRequests.length === 0 && (
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
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {/* Show first page if not on first */}
          {currentPage > 2 && (
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => goToPage(1)}
            >
              1
            </button>
          )}
          {/* Ellipsis if needed */}
          {currentPage > 3 && <span className="px-2">...</span>}
          {/* Show previous page if not on first */}
          {currentPage > 1 && (
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => goToPage(currentPage - 1)}
            >
              {currentPage - 1}
            </button>
          )}
          {/* Current page */}
          <button
            className="px-3 py-1 rounded bg-red-600 text-white"
            disabled
          >
            {currentPage}
          </button>
          {/* Show next page if not on last */}
          {currentPage < totalPages && (
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => goToPage(currentPage + 1)}
            >
              {currentPage + 1}
            </button>
          )}
          {/* Ellipsis if needed */}
          {currentPage < totalPages - 2 && <span className="px-2">...</span>}
          {/* Show last page if not near end */}
          {currentPage < totalPages - 1 && (
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => goToPage(totalPages)}
            >
              {totalPages}
            </button>
          )}
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
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
      {imageModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setImageModal({ open: false, src: '' })}>
          <div className="relative max-w-3xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-white bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-90 focus:outline-none"
              onClick={() => setImageModal({ open: false, src: '' })}
              aria-label="Close image modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={imageModal.src}
              alt="Certificate"
              className="max-h-[80vh] max-w-full rounded shadow-lg border-4 border-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;
