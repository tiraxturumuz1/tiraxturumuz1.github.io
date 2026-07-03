import React, useState from 'react';
import { useAuth } from '../context/AuthContext';

const Payment = () => {
  const { user, isAuthenticated } = useAuth();
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('idle'); // idle | processing | success | error
  const [errorMessage, setErrorMessage] = useState('');

  // تابع کمکی برای ارسال درخواست به بک‌اِند
  const callBackend = async (endpoint, body) => {
    const response = await fetch(`http://localhost:5000${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_PI_API_KEY // کلیدی که در .env فرانت تعریف کردیم
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Backend error');
    }
    return response;
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      alert("Please login with Pi Account first!");
      return;
    }

    if (!amount || amount <= 0) {
      setErrorMessage("Please enter a valid amount.");
      setStatus('error');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      // ۱. ایجاد درخواست پرداخت در Pi Browser
      const payment = await window.Pi.createPayment({
        amount: parseFloat(amount),
        memo: "Contribution to PiDao Project",
        metadata: {
          userId: user.username,
          projectId: "pidao-001"
        }
      });

      console.log("Payment initiated:", payment);

      // ۲. مرحله Approve در بک‌اِند
      // ما paymentId را از Pi دریافت می‌کنیم و به بک‌اِند می‌فرستیم تا تایید کند
      await callBackend('/approve', { paymentId: payment.paymentId });
      console.log("Payment approved by backend");

      // ۳. مرحله Complete در بک‌اِند
      // در دنیای واقعی، ما باید txid را هم داشته باشیم. 
      // در اینجا فرض می‌کنیم فرانت‌اند اطلاعات لازم را از نتیجه تراکنش می‌گیرد.
      // نکته: برای تست ساده، فعلاً txid را به صورت موقت می‌فرستیم یا از اوبجکت payment می‌گیریم
      await callBackend('/complete', { 
        paymentId: payment.paymentId, 
        txid: payment.txid || "dummy_txid_for_test" 
      });

      console.log("Payment completed successfully!");
      setStatus('success');
      setAmount(''); // خالی کردن فیلد بعد از موفقیت

    } catch (error) {
      console.error("Payment error:", error);
      setStatus('error');
      setErrorMessage(error.message || "Transaction failed or was cancelled.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="payment-card locked">
        <h3>Join the DAO</h3>
        <p>Please login with your Pi Account to contribute to the project.</p>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className={`payment-card ${status === 'success' ? 'success' : ''}`}>
        <h2>Contribute to PiDao</h2>
        <p>Support the ecosystem by sending Pi tokens.</p>

        <div className="payment-input-group">
          <label>Amount (Pi)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            disabled={status === 'processing'}
          />
        </div>

        <button
          className={`btn-pay ${status === 'processing' ? 'processing' : ''}`}
          onClick={handlePayment}
          disabled={status === 'processing'}
        >
          {status === 'processing' ? 'Processing...' : `Pay ${amount || 0} Pi`}
        </button>

        {status === 'error' && <div className="alert error">{errorMessage}</div>}
        {status === 'success' && <div className="alert success">✅ Payment Verified! Thank you.</div>}
      </div>
    </div>
  );
};

export default Payment;
