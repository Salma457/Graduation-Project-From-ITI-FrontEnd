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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      };

      try {
        // نجرب نجيب بيانات الـ employer أولاً
        const employerRes = await axios.get('http://localhost:8000/api/employer-profile', config);
        const employerUser = employerRes.data.user || employerRes.data;
        if (employerUser) {
          dispatch(setUser({ ...employerUser, role: 'employer' }));
          localStorage.setItem('user', JSON.stringify({ ...employerUser, role: 'employer' }));
          localStorage.setItem('user-id', employerUser?.id || employerUser?.user_id);
          return;
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("Error fetching employer profile:", err);
        }
      }

      try {
        const itianRes = await axios.get('http://localhost:8000/api/itian-profile', config);
        const itianUser = itianRes.data.user || itianRes.data;
        if (itianUser) {
          dispatch(setUser({ ...itianUser, role: 'itian' }));
          localStorage.setItem('user', JSON.stringify({ ...itianUser, role: 'itian' }));
          localStorage.setItem('user-id', itianUser?.id || itianUser?.user_id);
          return;
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("Error fetching itian profile:", err);
        }
      }

      console.warn("❌ No valid profile found for current user.");
    };

    fetchUserData();
  }, [dispatch]);
};

export default useAuthInit;
