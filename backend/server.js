// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// ---------------------------------
// Middleware: JWT Auth
// ---------------------------------
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: invalid token" });
  }
};

// ---------------------------------
// Pi Network API client on backend
// ---------------------------------
const piApi = axios.create({
  baseURL: process.env.PI_API_BASE_URL || "https://api.minepi.com",
  headers: {
    Authorization: `Key ${process.env.PI_API_KEY}`,
    "Content-Type": "application/json",
  },
});

// ---------------------------------
// Payment create
// ---------------------------------
app.post("/api/payment/create", async (req, res) => {
  try {
    const { amount, memo } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // این endpoint را با endpoint واقعی Pi API هماهنگ کن
    const response = await piApi.post("/payments", {
      amount,
      memo,
    });

    return res.status(200).json({
      message: "Payment created",
      paymentId: response.data?.paymentId || response.data?.id,
      raw: response.data,
    });
  } catch (error) {
    console.error("create payment error:", error?.response?.data || error.message);
    return res.status(500).json({
      message: "Failed to create payment",
      error: error?.response?.data || error.message,
    });
  }
});

// ---------------------------------
// Payment approve
// ---------------------------------
app.post("/api/payment/approve", async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: "paymentId is required" });
    }

    // این endpoint را مطابق Pi Network API واقعی خودت تنظیم کن
    const response = await piApi.post(`/payments/${paymentId}/approve`);

    return res.status(200).json({
      message: "Payment approved successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("approve payment error:", error?.response?.data || error.message);
    return res.status(500).json({
      message: "Failed to approve payment",
      error: error?.response?.data || error.message,
    });
  }
});

// ---------------------------------
// Payment complete
// ---------------------------------
app.post("/api/payment/complete", async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: "paymentId is required" });
    }

    const response = await piApi.post(`/payments/${paymentId}/complete`);

    return res.status(200).json({
      message: "Payment completed successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("complete payment error:", error?.response?.data || error.message);
    return res.status(500).json({
      message: "Failed to complete payment",
      error: error?.response?.data || error.message,
    });
  }
});

// ---------------------------------
// Payment status
// ---------------------------------
app.get("/api/payment/status/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;

    const response = await piApi.get(`/payments/${paymentId}`);

    return res.status(200).json({
      status: response.data?.status,
      data: response.data,
    });
  } catch (error) {
    console.error("payment status error:", error?.response?.data || error.message);
    return res.status(500).json({
      message: "Failed to get payment status",
      error: error?.response?.data || error.message,
    });
  }
});

// ---------------------------------
// Protected admin transactions
// ---------------------------------
app.get("/api/admin/transactions", authenticateJWT, async (req, res) => {
  try {
    // اینجا منبع واقعی تراکنش‌ها را از DB یا سرویس داخلی بخوان
    const transactions = [
      {
        id: "tx_1",
        amount: 10,
        status: "completed",
      },
    ];

    return res.status(200).json({
      message: "Transactions fetched successfully",
      transactions,
      user: req.user,
    });
  } catch (error) {
    console.error("transactions error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch transactions",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
