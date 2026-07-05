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
    setLoading(true); setError(''); setStatus('');
    try {
      const data = await PiService.createPayment({ amount: Number(amount), memo });
      setPaymentId(data.paymentId || data.id);
      setStatus('Payment initiated. Please check Pi Browser.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create payment');
    } finally { setLoading(false); }
  };

  const handleApprove = async () => {
    if (!paymentId) return setError('No Payment ID');
    setLoading(true); setError('');
    try {
      const data = await PiService.approvePayment(paymentId);
      setStatus(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Approval failed');
    } finally { setLoading(false); }
  };

  const handleComplete = async () => {
    if (!paymentId) return setError('No Payment ID');
    setLoading(true); setError('');
    try {
      const data = await PiService.completePayment({ 
        paymentId, 
        txid: paymentId, // در دنیای واقعی باید txid واقعی از SDK بگیرید
        paymentDetails: { amount: Number(amount), memo } 
      });
      setStatus(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Completion failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h3>Pi Payment Gateway</h3>
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={{width: '100%', marginBottom: '10px'}}/>
      <input type="text" placeholder="Memo" value={memo} onChange={e => setMemo(e.target.value)} style={{width: '100%', marginBottom: '10px'}}/>
      <input type="text" placeholder="Payment ID (for testing)" value={paymentId} onChange={e => setPaymentId(e.target.value)} style={{width: '100%', marginBottom: '10px'}}/>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button onClick={handleCreatePayment} disabled={loading}>1. Create</button>
        <button onClick={handleApprove} disabled={loading}>2. Approve</button>
        <button onClick={handleComplete} disabled={loading} style={{gridColumn: 'span 2'}}>3. Complete</button>
      </div>

      {loading && <p>Processing...</p>}
      {status && <p style={{ color: 'green' }}>{status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Payment;
