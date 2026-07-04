import axios from 'axios';

/**
 * PiService - نسخه بازسازی شده و امن
 * وظیفه این سرویس فقط ارسال درخواست‌ها به بک‌انند است.
 * تمام منطق حساس و کلیدهای API به بک‌انند منتقل شده‌اند.
 */

// گرفتن آدرس پایه بک‌انند از متغیر محیطی Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ایجاد یک نمونه axios برای مدیریت راحت‌تر درخواست‌ها
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const PiService = {
    /**
     * مرحله ۱: درخواست تایید پرداخت از بک‌انند
     * @param {Object} paymentData - شامل piTransactionId، amount و walletAddress
     */
    async approvePayment(paymentData) {
        try {
            // ما به جای صدا زدن مستقیم Pi، بک‌انند خودمان را صدا می‌زنیم
            const response = await apiClient.post('/payment/approve', paymentData);
            return response.data; 
            // خروجی شامل { success: true, piTransactionId: '...' } خواهد بود
        } catch (error) {
            console.error('Error in PiService.approvePayment:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to approve payment' };
        }
    },

    /**
     * مرحله ۲: نهایی کردن تراکنش پس از تایید کلاینت
     * @param {string} piTransactionId 
     * @param {Object} paymentDetails 
     */
    async completeTransaction(piTransactionId, paymentDetails) {
        try {
            const response = await apiClient.post('/payment/complete', {
                piTransactionId,
                paymentDetails
            });
            return response.data;
        } catch (error) {
            console.error('Error in PiService.completeTransaction:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to complete transaction' };
        }
    },

    /**
     * دریافت تراکنش‌ها (فقط اگر کاربر دسترسی ادمین داشته باشد)
     * @param {string} adminKey - کلیدی که از طریق ورود ادمین به دست آمده
     */
    async getAdminTransactions(adminKey) {
        try {
            const response = await apiClient.get('/admin/transactions', {
                headers: {
                    'x-admin-key': adminKey // ارسال کلید ادمین در هدر
                }
            });
            return response.
