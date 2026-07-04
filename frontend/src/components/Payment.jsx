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
      boxSizing: 'border-box',
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

    if (!window.Pi) {
      setError('SDK پرداخت Pi در دسترس نیست. لطفاً برنامه را داخل مرورگر Pi اجرا کنید.');
      setLoading(false);
      return;
    }

    try {
      // 1. استفاده از SDK اصلی Pi به جای Fetch ساده
      window.Pi.createPayment(
        {
          amount: parseFloat(amount), // مبلغی که کاربر وارد کرده
          memo: 'PiDao Membership',
          metadata: { orderId: `ORDER-${Date.now()}` }
        },
        {
          onReadyForServerApproval: async (paymentId) => {
            // این همان بخشی است که به بک‌اِند شما (پورت 3000) وصل می‌شود
            await fetch('http://localhost:3000/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId })
            });
          },

          onReadyForServerCompletion: async (paymentId, txid) => {
            // تایید نهایی تراکنش
            const response = await fetch('http://localhost:3000/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid })
            });

            if (response.ok) {
              // اینجا صفحه موفقیت را نشان می‌دهیم
              onPaymentSuccess(txid);
            } else {
              setError('خطا در تایید نهایی تراکنش.');
            }

            setLoading(false);
          },

          onCancel: (paymentId) => {
            setError('پرداخت توسط کاربر لغو شد.');
            setLoading(false);
          },

          onError: (error) => {
            setError('خطا در پرداخت: ' + error.message);
            setLoading(false);
          }
        }
      );
    } catch (err) {
      console.error('Payment Error:', err);
      setError('خطا در اجرای پرداخت. لطفاً دوباره تلاش کنید.');
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
            backgroundColor: loading ? '#ccc' : '#4A90E2',
            cursor: loading ? 'not-allowed' : 'pointer'
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
