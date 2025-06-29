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
const fetchUserData = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  };

  try {
    // نحاول نجيب بيانات employer
    const employerRes = await axios.get('http://localhost:8000/api/employer-profile', config);
    const employerUser = employerRes.data.user || employerRes.data;

    if (employerUser) {
      dispatch(setUser({
        user: employerUser,
        role: 'employer',
        employer_profile: employerUser,
        itian_profile: null
      }));

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
     const itianProfile = itianRes.data;

      dispatch(setUser({
        user: { id: itianProfile.user_id }, 
        role: 'itian',
        itian_profile: itianProfile,
        employer_profile: null
      }));

      localStorage.setItem('user-id', itianProfile.user_id);
      return;
    }
    catch (err) {
        if (err.response?.status !== 404) {
          console.error("Error fetching itian profile:", err);
        }
    }

  console.warn("❌ No valid profile found for current user.");
};

    initAuth();
  }, [dispatch]);
};

export default useAuthInit;