import React, { useState } from 'react';
import PiService from '../services/PiService';

const Payment = () => {
  const [amount, setAmount] = useState(1);
  const [memo, setMemo] = useState('PiDao payment');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setStatus('');
      setPaymentResult(null);

      if (!window.Pi) {
        throw new Error('Pi SDK پیدا نشد. لطفاً مطمئن شوید برنامه داخل Pi Browser اجرا می‌شود.');
      }

      const numericAmount = Number(amount);

      if (!numericAmount || numericAmount <= 0) {
        throw new Error('مبلغ پرداخت باید بیشتر از صفر باشد.');
      }

      setStatus('در حال ایجاد پرداخت در Pi Network...');

      window.Pi.createPayment(
        {
          amount: numericAmount,
          memo: memo || 'PiDao payment',
          metadata: {
            app: 'PiDao',
            source: 'frontend',
            createdAt: new Date().toISOString(),
          },
        },
        {
          /**
           * این callback وقتی اجرا می‌شود که Pi SDK پرداخت را ساخته
           * و حالا backend باید آن را approve کند.
           */
          onReadyForServerApproval: async (paymentId) => {
            try {
              setStatus('پرداخت ساخته شد. در حال تأیید توسط سرور...');

              const approvalResponse = await PiService.approvePayment({
                paymentId,
                amount: numericAmount,
                memo: memo || 'PiDao payment',
              });

              console.log('Server approval response:', approvalResponse);

              setStatus('پرداخت توسط سرور تأیید شد. لطفاً مرحله پرداخت را کامل کنید.');
            } catch (error) {
              console.error('Server approval error:', error);

              setStatus(
                error?.error ||
                  error?.message ||
                  'خطا در تأیید پرداخت توسط سرور.'
              );

              setLoading(false);
            }
          },

          /**
           * این callback وقتی اجرا می‌شود که کاربر پرداخت را در Pi تأیید کرده
           * و حالا backend باید آن را complete کند و در دیتابیس ذخیره کند.
           */
          onReadyForServerCompletion: async (paymentId, txid) => {
            try {
              setStatus('پرداخت انجام شد. در حال ثبت نهایی تراکنش در سرور...');

              const completionResponse = await PiService.completeTransaction(
                txid || paymentId,
                {
                  paymentId,
                  txid,
                  amount: numericAmount,
                  memo: memo || 'PiDao payment',
                  app: 'PiDao',
                }
              );

              console.log('Server completion response:', completionResponse);

              setPaymentResult(completionResponse);

              if (completionResponse?.success) {
                setStatus('پرداخت با موفقیت تکمیل و ثبت شد.');
              } else {
                setStatus(
                  completionResponse?.message ||
                    'پرداخت ارسال شد اما پاسخ موفق از سرور دریافت نشد.'
                );
              }

              setLoading(false);
            } catch (error) {
              console.error('Server completion error:', error);

              setStatus(
                error?.error ||
                  error?.message ||
                  'خطا در ثبت نهایی تراکنش.'
              );

              setLoading(false);
            }
          },

          /**
           * زمانی که کاربر پرداخت را لغو کند.
           */
          onCancel: (paymentId) => {
            console.warn('Payment cancelled:', paymentId);

            setStatus('پرداخت توسط کاربر لغو شد.');
            setLoading(false);
          },

          /**
           * مدیریت خطاهای Pi SDK
           */
          onError: (error, payment) => {
            console.error('Pi payment error:', error, payment);

            setStatus(
              error?.message ||
                'خطا در فرآیند پرداخت Pi Network رخ داد.'
            );

            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error('Payment error:', error);

      setStatus(error?.message || 'خطا در شروع پرداخت.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>پرداخت با Pi</h2>

        <p style={styles.description}>
          برای ادامه، مبلغ پرداخت را وارد کرده و دکمه پرداخت را بزنید.
        </p>

        <div style={styles.formGroup}>
          <label style={styles.label}>مبلغ پرداخت Pi</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            disabled={loading}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>توضیح پرداخت</label>
          <input
            type="text"
            value={memo}
            disabled={loading}
            onChange={(e) => setMemo(e.target.value)}
            style={styles.input}
          />
        </div>

        <button
          type="button"
          onClick={handlePayment}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'در حال پردازش...' : 'پرداخت با Pi'}
        </button>

        {status && (
          <div style={styles.statusBox}>
            {status}
          </div>
        )}

        {paymentResult && (
          <pre style={styles.resultBox}>
            {JSON.stringify(paymentResult, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    boxSizing: 'border-box',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '24px',
    borderRadius: '16px',
    background: '#ffffff',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    border: '1px solid #eee',
  },
  title: {
    margin: '0 0 12px',
    fontSize: '24px',
    fontWeight: '700',
    color: '#222',
  },
  description: {
    margin: '0 0 20px',
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#666',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    fontSize: '15px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '10px',
    background: '#7b2cbf',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
  },
  statusBox: {
    marginTop: '16px',
    padding: '12px',
    borderRadius: '10px',
    background: '#f6f2ff',
    color: '#4a148c',
    fontSize: '14px',
    lineHeight: '1.7',
  },
  resultBox: {
    marginTop: '16px',
    padding: '12px',
    borderRadius: '10px',
    background: '#111',
    color: '#00ff99',
    fontSize: '12px',
    overflowX: 'auto',
    direction: 'ltr',
    textAlign: 'left',
  },
};

export default Payment;
