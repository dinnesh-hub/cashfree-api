import { Router } from "express";
import {
  createOrderController,
  getOrderStatusController,
  handleWebhookController,
} from "@/controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post("/create-order", createOrderController);
paymentRouter.get("/:orderId/status", getOrderStatusController);
paymentRouter.post("/webhook", handleWebhookController);

export default paymentRouter;
