import React, { useState } from 'react';

const Payment = ({ onPaymentSuccess }) => {
  const [amount, setAmount] = useState('10'); // مقدار پیش‌فرض ۱۰ عدد از Pi
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const styles = {
    card: {
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      textAlign: 'center',
      fontFamily: 'Tahoma, sans-serif',
      direction: 'rtl'
    },
    title: {
      color: '#333',
      marginBottom: '20px',
      fontSize: '22px'
    },
    inputGroup: {
      marginBottom: '20px',
      textAlign: 'right'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#666',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '18px',
      boxSizing: 'border-box', // برای اینکه عرض ورودی از کادر بیرون نزند
      textAlign: 'center'
    },
    button: {
      width: '100%',
      padding: '14px',
      fontSize: '18px',
      backgroundColor: '#4A90E2',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background 0.3s'
    },
    error: {
      color: '#d9534f',
      backgroundColor: '#f2dede',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '15px',
      fontSize: '14px'
    },
    info: {
      marginTop: '20px',
      fontSize: '13px',
      color: '#888'
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ۱. ابتدا یک درخواست برای تایید اولیه به بک‌اِند می‌فرستیم
      const approveRes = await fetch('http://localhost:5000/api/payment/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const approveData = await approveRes.json();

      if (approveData.success) {
        const transactionId = approveData.transactionId;

        // ۲. حالا اطلاعات پرداخت را برای ثبت نهایی در دیتابیس می‌فرستیم
        const completeRes = await fetch('http://localhost:5000/api/payment/complete', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-api-key': 'your_very_secure_api_key_123' // حتماً این کلید باید با فایل .env بک‌اِند یکی باشد
          },
          body: JSON.stringify({
            transactionId: transactionId,
            paymentDetails: {
              amount: parseFloat(amount),
              currency: 'PI',
              productName: 'PiDao Membership',
              orderId: `ORDER-${Date.now()}`
            }
          })
        });

        const completeData = await completeRes.json();

        if (completeData.success) {
          // ۳. اگر همه چیز عالی بود، تابع موفقیت را که از App.jsx آمده صدا می‌زنیم
          onPaymentSuccess(transactionId);
        } else {
          setError(completeData.message || 'خطا در ثبت تراکنش.');
        }
      } else {
        setError('خطا در تایید اولیه پرداخت.');
      }
    } catch (err) {
      console.error('Payment Error:', err);
      setError('خطا در اتصال به سرور. مطمئن شوید بک‌اِند روشن است.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>🛒 خرید اشتراک PiDao</h2>
      
      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handlePayment}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>مبلغ مورد نظر (به واحد PI):</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
            placeholder="مثلاً 10"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: loading ? '#ccc' : '#4A90E2'
          }}
        >
          {loading ? 'در حال پردازش...' : 'پرداخت و تایید'}
        </button>
      </form>

      <p style={styles.info}>
        با کلیک بر روی دکمه، شما با قوانین پرداخت PiDao موافقت می‌کنید.
      </p>
    </div>
  );
};

export default Payment;
