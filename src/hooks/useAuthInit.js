// hooks/useAuthInit.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../store/userSlice';

// useAuthInit.js
const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('access-token');
    if (!token) return;

    const fetchUser = async () => {
      try {
        const profileResponse = await axios.get('http://localhost:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = profileResponse.data;

        if (user.role === 'itian') {
          const itianProfile = await axios.get('http://localhost:8000/api/itian-profile', {
            headers: { Authorization: `Bearer ${token}` },
          });

          dispatch(setUser({
            user,
            role: 'itian',
            itian_profile: itianProfile.data,
          }));
        } else if (user.role === 'employer') {
          const employerProfile = await axios.get('http://localhost:8000/api/employer-profile', {
            headers: { Authorization: `Bearer ${token}` },
          });

          dispatch(setUser({
            user,
            role: 'employer',
            employer_profile: employerProfile.data,
          }));
        }

        // Add admin case if needed
      } catch (err) {
        console.error("Auth Init Error:", err);
      }
    };

    fetchUser();
  }, []);
};

export default useAuthInit;
