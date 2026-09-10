import { Router } from "express";
import {
  createOrderController,
  getOrderStatusController,
} from "@/controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post("/create-order", createOrderController);
paymentRouter.get("/:orderId/status", getOrderStatusController);

export default paymentRouter;
