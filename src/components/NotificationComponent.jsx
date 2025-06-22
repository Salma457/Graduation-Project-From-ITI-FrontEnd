import { useEffect, useState, useRef } from 'react';
import { useGetNotificationsQuery } from '../api/Notification';
import { useSelector } from 'react-redux';
import { Bell } from 'lucide-react';

const NotificationComponent = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const user = useSelector((state) => state.user.user);
  const isItian = user?.role === 'itian';

  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useGetNotificationsQuery(undefined, {
    skip: !isItian,
    pollingInterval: 30000,
  });

  useEffect(() => {
    // إغلاق القائمة عند النقر خارجها
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
console.log("User from Redux:", user);
console.log("Is Itian:", isItian);

  if (!isItian) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-100 relative transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl rounded-lg max-h-96 overflow-auto z-50">
          <div className="sticky top-0 bg-white p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <div>
              {isError && (
                <button 
                  onClick={refetch}
                  className="text-xs text-blue-500 hover:underline mr-2"
                >
                  Retry
                </button>
              )}
              <button 
                onClick={() => setOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading notifications...</div>
          ) : isError ? (
            <div className="p-4 text-center text-red-500">
              Failed to load notifications. Please try again.
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification, index) => (
                <div 
                  key={`notification-${index}`}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="font-medium text-gray-900">
                    {notification.data?.message || 'New notification'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              No new notifications
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;