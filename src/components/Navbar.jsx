import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../store/userSlice';
import Notifications from '../components/Notification'; // عدلي المسار حسب مكانه

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem('access-token');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
      <div className="text-xl font-bold">My App</div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
              <Notifications />
            <span>👤 {user.name || user.email}</span>
            <span className="text-sm bg-gray-700 px-2 py-1 rounded">{role}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <a href="/login" className="text-sm underline">Login</a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
