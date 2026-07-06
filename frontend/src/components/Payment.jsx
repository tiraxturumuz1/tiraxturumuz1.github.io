import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../lib/axiosClient';
import '../components/Payment.css'; // فرض بر وجود استایل

const Payment = ({ onPaymentSuccess, onPaymentError }) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // این مقادیر از .env خوانده می‌شوند (طبق فایل env که فرستادید)
  const PI_APP_ID = import.meta.env.VITE_PI_APP_ID;
  const PI_CLIENT_ID = import.meta.env.VITE_PI_CLIENT_ID;

  useEffect(() => {
    // اطمینان از بارگذاری SDK شبکه Pi
    if (window.Pi) {
      console.log("Pi Network SDK is ready");
    } else {
      setError("Pi SDK not found. Please ensure you are running in the Pi Browser.");
    }
  }, []);

  const handlePayment = async () => {
    if (!window.Pi) {
      setError("Pi SDK is not available.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // ۱. ایجاد درخواست پرداخت از طریق Pi SDK
      const payment = await window.Pi.createPayment({
        amount: 1.0, // این مقدار می‌تواند به عنوان prop ورودی هم باشد
        memo: "Purchase from PiDao",
        metadata: {
          productId: "item_123", // مثال
          userId: user?.id || 'guest',
        },
      });

      // ۲. مرحله تایید توسط سرور (Server Approval)
      // به جای fetch مستقیم به localhost:3000، از axiosClient استفاده می‌کنیم
      // که طبق تنظیمات شما به https://apppidaonkm2562.pinet.com/api وصل می‌شود
      
      await window.Pi.onReadyForServerApproval(async (paymentId) => {
        try {
          console.log("Waiting for server approval for:", paymentId);
          
          // ارسال درخواست تایید به بک‌اِند خودمان
          await axiosClient.post('/payment/approve', {
            paymentId: paymentId,
          });

          // اگر بک‌اِند تایید کرد، به مرحله تکمیل برو
          await window.Pi.onReadyForServerCompletion(async (paymentId, txid) => {
            try {
              // ۳. مرحله نهایی کردن پرداخت (Completion)
              await axiosClient.post('/payment/complete', {
                paymentId: paymentId,
                txid: txid,
                paymentDetails: {
                  amount: 1.0,
                  currency: 'PI'
                }
              });

              console.log("Payment completed successfully!");
              onPaymentSuccess(txid); // صدا کردن تابع موفقیت در App.jsx
            } catch (err) {
              console.error("Completion error:", err);
              setError("Failed to complete transaction. Please check your history.");
              setIsProcessing(false);
            }
          });

        } catch (err) {
          console.error("Approval error:", err);
          setError("Server approval failed.");
          setIsProcessing(false);
        }
      });

    } catch (err) {
      console.error("Payment initiation error:", err);
      setError(err.message || "Payment failed to start.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>Complete Your Purchase</h2>
      
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      <div className="payment-details">
        <p>Amount: <strong>1.0 PI</strong></p>
        <p>Product: <strong>PiDao Premium Item</strong></p>
      </div>

      <button 
        className="pay-button" 
        onClick={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Pay with Pi'}
      </button>

      {isProcessing && <div className="loader">Please do not close the Pi Browser...</div>}
    </div>
  );
};

export default Payment;
