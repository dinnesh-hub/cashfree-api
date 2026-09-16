import { Router } from "express";
import {
  createOrderController,
  getOrderStatusController,
  getPaymentStatusController,
  handleWebhookController,
} from "@/controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post("/create-order", createOrderController);
paymentRouter.get("/:orderId/status", getOrderStatusController);
paymentRouter.get("/:orderId/payment-status", getPaymentStatusController);
paymentRouter.post("/webhook", handleWebhookController);

export default paymentRouter;
