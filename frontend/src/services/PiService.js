import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const PiService = {
  async approvePayment(paymentData) {
    try {
      const response = await apiClient.post('/payment/approve', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error in approvePayment:', error.response?.data || error.message);
      throw error.response?.data || { error: 'Failed to approve payment' };
    }
  },

  async completeTransaction(piTransactionId, paymentDetails) {
    try {
      const response = await apiClient.post('/payment/complete', {
        piTransactionId,
        paymentDetails,
      });

      return response.data;
    } catch (error) {
      console.error('Error in completeTransaction:', error.response?.data || error.message);
      throw error.response?.data || { error: 'Failed to complete transaction' };
    }
  },

  async getAdminTransactions(adminKey) {
    try {
      const response = await apiClient.get('/admin/transactions', {
        headers: {
          'x-admin-key': adminKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error in getAdminTransactions:', error.response?.data || error.message);
      throw error.response?.data || { error: 'Failed to fetch transactions' };
    }
  },
};

export default PiService;
