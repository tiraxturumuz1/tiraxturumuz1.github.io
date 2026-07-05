// frontend/src/services/PiService.js
import axiosClient from "../api/axiosClient";

const PiService = {
  // ایجاد درخواست پرداخت در backend
  createPayment: async (paymentData) => {
    try {
      const response = await axiosClient.post("/api/payment/create", paymentData);
      return response.data;
    } catch (error) {
      console.error("PiService.createPayment error:", error);
      throw error;
    }
  },

  // تایید پرداخت در backend
  approvePaymentOnBackend: async (paymentId) => {
    try {
      const response = await axiosClient.post("/api/payment/approve", {
        paymentId,
      });
      return response.data;
    } catch (error) {
      console.error("PiService.approvePaymentOnBackend error:", error);
      throw error;
    }
  },

  // تکمیل پرداخت در backend
  completePaymentOnBackend: async (paymentId) => {
    try {
      const response = await axiosClient.post("/api/payment/complete", {
        paymentId,
      });
      return response.data;
    } catch (error) {
      console.error("PiService.completePaymentOnBackend error:", error);
      throw error;
    }
  },

  // گرفتن وضعیت پرداخت
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await axiosClient.get(`/api/payment/status/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("PiService.getPaymentStatus error:", error);
      throw error;
    }
  },
};

export default PiService;
