// frontend/src/components/Payment.jsx
import React, { useState } from 'react';
import PiService from '../services/PiService';

const Payment = () => {
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('PiDao payment');
  const [paymentId, setPaymentId] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreatePayment = async () => {
    setLoading(true);
    setError('');
    setStatus('');

    try {
      const data = await PiService.createPayment({
        amount: Number(amount),
        memo,
      });

      setPaymentId(data.paymentId || data.id || '');
      setStatus(data.message || 'Payment created successfully');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          'Failed to create payment'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async () => {
    if (!paymentId) {
      setError('Payment ID is required');
      return;
    }

    setLoading(true);
    setError('');
    setStatus('');

    try {
      const data = await PiService.approvePaymentOnBackend(paymentId);
      setStatus(data.message || 'Payment approved successfully');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          'Failed to approve payment'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePayment = async () => {
    if (!paymentId) {
      setError('Payment ID is required');
      return;
    }

    setLoading(true);
    setError('');
    setStatus('');

    try {
      const data = await PiService.completePaymentOnBackend({
        paymentId,
        txid: data?.txid || paymentId,
        paymentDetails: {
          memo,
          amount: Number(amount),
        },
      });

      setStatus(data.message || 'Payment completed successfully');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          'Failed to complete payment'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!paymentId) {
      setError('Payment ID is required');
      return;
    }

    setLoading(true);
    setError('');
    setStatus('');

    try {
      const data = await PiService.getPaymentStatus(paymentId);
      setStatus(`Status: ${data.status || 'unknown'}`);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          'Failed to fetch payment status'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: 20 }}>
      <h2>Pi Payment</h2>

      <div style={{ marginBottom: 12 }}>
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
          placeholder="Enter amount"
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Memo</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
          placeholder="Enter memo"
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Payment ID</label>
        <input
          type="text"
          value={paymentId}
          onChange={(e) => setPaymentId(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
          placeholder="Payment ID"
        />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={handleCreatePayment} disabled={loading}>
          Create
        </button>
        <button onClick={handleApprovePayment} disabled={loading}>
          Approve
        </button>
        <button onClick={handleCompletePayment} disabled={loading}>
          Complete
        </button>
        <button onClick={handleCheckStatus} disabled={loading}>
          Status
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {status && <p style={{ color: 'green' }}>{status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Payment;
