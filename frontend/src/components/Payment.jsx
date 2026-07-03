import React, { useState } from 'react';

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // خواندن متغیرها از فایل .env فرانت‌اِند
  const API_BASE_URL = import.meta.env.VITE_PI_BACKEND_URL;
  const PI_API_KEY = import.meta.env.VITE_PI_API_KEY;

  const handlePayment = async (paymentData) => {
    setLoading(true);
    setMessage('');

    try {
      // مرحله اول: ارسال درخواست برای تایید اولیه به بک‌اِند
      const response = await fetch(`${API_BASE_URL}/api/payment/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ارسال کلید امنیتی در هدر برای تایید هویت درخواست توسط بک‌اِند
          'x-api-key': PI_API_KEY 
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('درخواست با موفقیت تایید شد. در حال پردازش پرداخت...');
        
        // مرحله دوم: تماس با بک‌اِند برای نهایی کردن تراکنش (بعد از تایید شبکه Pi)
        // فرض بر این است که پرداخت در شبکه Pi انجام شده و حالا باید در دیتابیس ثبت شود
        const completeResponse = await fetch(`${API_BASE_URL}/api/payment/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': PI_API_KEY
          },
          body: JSON.stringify({
            transactionId: data.transactionId, // آی‌دی که از مرحله قبل گرفتیم
            paymentDetails: paymentData
          }),
        });

        if (completeResponse.ok) {
          setMessage('🎉 پرداخت با موفقیت انجام شد و در سیستم ثبت گردید!');
        } else {
          const errorData = await completeResponse.json();
          throw new Error(errorData.message || 'خطا در ثبت نهایی پرداخت');
        }

      } else {
        throw new Error(data.message || 'خطا در تایید پرداخت');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      setMessage(`❌ خطا: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>پرداخت امن با شبکه Pi</h2>
      {message && <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>{message}</div>}
      
      {/* در اینجا دکمه یا فرم پرداخت شما قرار می‌گیرد */}
      <button 
        disabled={loading} 
        onClick={() => handlePayment({ amount: 10, currency: 'PI' })}
      >
        {loading ? 'در حال پردازش...' : 'پرداخت ۱۰ Pi'}
      </button>
    </div>
  );
};

export default Payment;
