import { Router } from "express";
import {
  createOrderController,
  getOrderStatusController,
  getPaymentStatusController,
  getUnifiedStatusController,
  handleWebhookController,
} from "@/controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post("/create-order", createOrderController);
paymentRouter.get("/:orderId/status", getOrderStatusController);
paymentRouter.get("/:orderId/payment-status", getPaymentStatusController);
paymentRouter.get("/:orderId/unified-status", getUnifiedStatusController);
paymentRouter.post("/webhook", handleWebhookController);

export default paymentRouter;
