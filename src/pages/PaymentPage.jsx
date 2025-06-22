import React from 'react';
import axios from 'axios';

function PaymentPage() {
  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('access-token'); // لو عندك توكن للمستخدم
      const response = await axios.post(
        'http://localhost:8000/api/create-checkout-session',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // فتح صفحة الدفع في Stripe
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('حدث خطأ أثناء إنشاء الدفع');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>ادفع 3 دولار لإضافة وظيفة</h2>
      <button
        onClick={handleCheckout}
        style={{
          backgroundColor: '#6772e5',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        ادفع الآن
      </button>
    </div>
  );
}

export default PaymentPage;
