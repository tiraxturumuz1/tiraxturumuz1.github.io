import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const PiService = {
  async initiatePayment(paymentDetails) {
    if (typeof window === 'undefined' || typeof window.Pi === 'undefined') {
      throw new Error('Pi SDK is not available.');
    }

    const payment = await window.Pi.createPayment({
      amount: paymentDetails.amount,
      memo: paymentDetails.memo || 'PiDao payment',
      metadata: {
        productId: paymentDetails.productId,
        userId: paymentDetails.userId,
      },
    });

    return payment;
  },

  async approvePayment(paymentData) {
    const response = await apiClient.post('/payment/approve', paymentData);
    return response.data;
  },

  async completeTransaction(piTransactionId, paymentDetails) {
    const response = await apiClient.post('/payment/complete', {
      piTransactionId,
      paymentDetails,
    });
    return response.data;
  },

  async getAdminTransactions(adminKey) {
    const response = await apiClient.get('/admin/transactions', {
      headers: {
        'x-admin-key': adminKey,
      },
    });
    return response.data;
  },
};

export default PiService;
