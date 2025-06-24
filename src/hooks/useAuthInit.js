import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../store/userSlice';

const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('access-token');
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        };

        try {
          const res = await axios.get('http://localhost:8000/api/itian-profile', config);
          const userData = res.data.user || res.data;
          dispatch(setUser({ ...userData, role: 'itian' }));
          localStorage.setItem('user', JSON.stringify({ ...userData, role: 'itian' }));
          localStorage.setItem('user-id', userData?.id || userData?.user_id);
          return;
        } catch (err) {
        }

        try {
          const res = await axios.get('http://localhost:8000/api/employer-profile', config);
          const userData = res.data.user || res.data;
          dispatch(setUser({ ...userData, role: 'employer' }));
          localStorage.setItem('user', JSON.stringify({ ...userData, role: 'employer' }));
          localStorage.setItem('user-id', userData?.id || userData?.user_id);
          return;
        } catch (err) {
        }

        console.warn("❌ No valid profile found for current user.");
      } catch (error) {
        console.error('🔥 Auth Init Error:', error);
      }
    };

    fetchUserData();
  }, [dispatch]);
};

export default useAuthInit;
