// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import Transaction from './models/Transaction.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;
const FRONTEND_URLS = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: FRONTEND_URLS.length ? FRONTEND_URLS : true,
    credentials: true,
  })
);
app.use(express.json());

// -------------------------------------
// MongoDB connection
// -------------------------------------
mongoose
  .connect(DATABASE_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// -------------------------------------
// JWT auth middleware
// -------------------------------------
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden: invalid token' });
  }
};

// -------------------------------------
// Pi API client on backend
// -------------------------------------
const piApi = axios.create({
  baseURL: process.env.PI_API_BASE_URL || 'https://api.minepi.com',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Key ${process.env.PI_API_KEY}`,
  },
});

// -------------------------------------
// Health check
// -------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'backend', time: new Date().toISOString() });
});

// -------------------------------------
// Create payment
// -------------------------------------
app.post('/api/payment/create', async (req, res) => {
  try {
    const { amount, memo, metadata = {} } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // این endpoint را با Pi Network API واقعی هماهنگ کن
    const response = await piApi.post('/payments', {
      amount: Number(amount),
      memo: memo || 'Pi payment',
      metadata,
    });

    return res.status(200).json({
      message: 'Payment created successfully',
      paymentId: response.data?.paymentId || response.data?.id,
      data: response.data,
    });
  } catch (error) {
    console.error('create payment error:', error?.response?.data || error.message);
    return res.status(500).json({
      message: 'Failed to create payment',
      error: error?.response?.data || error.message,
    });
  }
});

// -------------------------------------
// Approve payment
// -------------------------------------
app.post('/api/payment/approve', async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: 'paymentId is required' });
    }

    // پیاده‌سازی واقعی:
    // این قسمت باید مطابق مستندات Pi Network endpoint واقعی را صدا بزند
    const response = await piApi.post(`/payments/${paymentId}/approve`);

    return res.status(200).json({
      message: 'Payment approved successfully',
      paymentId,
      data: response.data,
    });
  } catch (error) {
    console.error('approve payment error:', error?.response?.data || error.message);
    return res.status(500).json({
      message: 'Failed to approve payment',
      error: error?.response?.data || error.message,
    });
  }
});

// -------------------------------------
// Complete payment
// -------------------------------------
app.post('/api/payment/complete', async (req, res) => {
  try {
    const { paymentId, txid, paymentDetails, userId = 'guest' } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: 'paymentId is required' });
    }

    const existingTransaction = await Transaction.findOne({
      piTransactionId: paymentId,
    });

    if (existingTransaction) {
      return res.status(409).json({
        message: 'Payment already completed or exists',
      });
    }

    // اگر Pi API مرحله completion دارد اینجا صدا زده شود
    const response = await piApi.post(`/payments/${paymentId}/complete`, {
      txid,
      paymentDetails,
    });

    const transaction = await Transaction.create({
      piTransactionId: paymentId,
      amount: paymentDetails?.amount || 0,
      currency: 'PI',
      userId,
      metadata: {
        productName: paymentDetails?.memo || 'Pi payment',
        orderId: paymentDetails?.orderId || null,
      },
      status: 'completed',
    });

    return res.status(200).json({
      message: 'Payment completed successfully',
      transaction,
      data: response.data,
    });
  } catch (error) {
    console.error('complete payment error:', error?.response?.data || error.message);
    return res.status(500).json({
      message: 'Failed to complete payment',
      error: error?.response?.data || error.message,
    });
  }
});

// -------------------------------------
// Payment status
// -------------------------------------
app.get('/api/payment/status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;

    const response = await piApi.get(`/payments/${paymentId}`);

    return res.status(200).json({
      status: response.data?.status || 'unknown',
      data: response.data,
    });
  } catch (error) {
    console.error('payment status error:', error?.response?.data || error.message);
    return res.status(500).json({
      message: 'Failed to get payment status',
      error: error?.response?.data || error.message,
    });
  }
});

// -------------------------------------
// Protected admin transactions
// -------------------------------------
app.get('/api/admin/transactions', authenticateJWT, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: 'Transactions fetched successfully',
      transactions,
    });
  } catch (error) {
    console.error('admin transactions error:', error.message);
    return res.status(500).json({
      message: 'Failed to fetch transactions',
    });
  }
});

// -------------------------------------
// Start server
// -------------------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
