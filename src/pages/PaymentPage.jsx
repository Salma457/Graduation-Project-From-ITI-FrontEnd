import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PaymentPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnusedPayment, setHasUnusedPayment] = useState(false);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const token = localStorage.getItem('access-token');
        const response = await axios.get('http://localhost:8000/api/has-unused-payment', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHasUnusedPayment(response.data.has_payment); // true لو عنده دفعة مش مستخدمة
      } catch (error) {
        console.error('Error checking payment status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, []);

  const handlePostJobClick = async () => {
    const token = localStorage.getItem('access-token');

    if (hasUnusedPayment) {
     
      navigate('/employer/post-job');
    } else {
      
      try {
        const response = await axios.post(
          'http://localhost:8000/api/create-checkout-session',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        window.location.href = response.data.url;
      } catch (error) {
        console.error('Error creating checkout session:', error);
        alert('حدث خطأ أثناء إنشاء الدفع');
      }
    }
  };

  if (isLoading) return <p>جارٍ التحقق من حالة الدفع...</p>;

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      
      <button
        onClick={handlePostJobClick}
        style={{
          backgroundColor: '#28a745',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        post job
      </button>
    </div>
  );
}

export default PaymentPage;
