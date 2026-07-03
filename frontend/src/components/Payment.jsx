import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchFromBackend } from '../services/PiService';

const Payment = () => {
    const { user, isAuthenticated } = useAuth();
    const [amount, setAmount] = useState(1); // مقدار پیش‌فرض پرداخت
    const [status, setStatus] = useState('idle'); // idle | processing | success | error
    const [errorMessage, setErrorMessage] = useState('');

    const handlePayment = async () => {
        if (!isAuthenticated) {
            alert("Please login first!");
            return;
        }

        try {
            setStatus('processing');
            setErrorMessage('');

            // ۱. مرحله اول: درخواست پرداخت از طریق Pi SDK
            // این مرحله در Pi Browser انجام می‌شود و کاربر را برای تایید تراکنش می‌برد
            const paymentResponse = await window.Pi.createPayment({
                amount: amount,
                memo: "Contribution to PiDao Project",
                metadata: {
                    projectId: "pidao-001",
                    user: user.username
                }
            });

            // ۲. مرحله دوم: ارسال اطلاعات پرداخت به بک‌اِند برای تایید نهایی
            // ما نمی‌توانیم به تراکنش اعتماد کنیم مگر اینکه بک‌اِند آن را در شبکه چک کند
            await fetchFromBackend('/payments/verify', 'POST', {
                paymentId: paymentResponse.paymentId,
                amount: amount,
                userId: user.id
            });

            setStatus('success');
            console.log("✅ Payment Verified!");
        } catch (error) {
            console.error("❌ Payment Error:", error);
            setStatus('error');
            setErrorMessage(error.message || "Transaction failed or cancelled.");
        }
    };

    // اگر کاربر لاگین نکرده باشد، یک پیام دعوت به همکاری نشان می‌دهیم
    if (!isAuthenticated) {
        return (
            <div className="payment-card locked">
                <h3>Join the DAO</h3>
                <p>Login with your Pi Account to participate in governance and payments.</p>
            </div>
        );
    }

    return (
        <div className="payment-card">
            <h3>Contribute to PiDao</h3>
            <p>Support the ecosystem by sending Pi tokens.</p>

            <div className="payment-input-group">
                <label>Amount (Pi):</label>
                <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                />
            </div>

            <button 
                className={`btn-pay ${status}`} 
                onClick={handlePayment}
                disabled={status === 'processing'}
            >
                {status === 'processing' ? 'Processing...' : `Pay ${amount} Pi`}
            </button>

            {status === 'success' && (
                <div className="alert success">🎉 Thank you! Your contribution is confirmed.</div>
            )}

            {status === 'error' && (
                <div className="alert error">❌ Error: {errorMessage}</div>
            )}
        </div>
    );
};

export default Payment;
