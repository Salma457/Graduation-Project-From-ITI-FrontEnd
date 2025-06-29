import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser, setLoading } from '../store/userSlice';

const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access-token');

      if (!token) {
        dispatch(setLoading(false));
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setUser(response.data));
      } catch (error) {
        console.error('Authentication initialization failed:', error);
        localStorage.removeItem('access-token');
        localStorage.removeItem('user-id');
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);
};

export default useAuthInit;