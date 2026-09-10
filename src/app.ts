import express from "express";
import cors from "cors";
import paymentRoutes from "@/routes/payment.routes";
import { errorHandler } from "@/middlewares/error.middleware";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Cashfree backend service is healthy and running",
  });
});

// API Routes
app.use("/api/payments", paymentRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
