import type { Request, Response, NextFunction } from "express";
import { createOrderService, getOrderService } from "@/services/cashfree.service";
import type { CreateOrderRequestBody } from "@/types/payment.types";

export const createOrderController = async (
  req: Request<{}, {}, CreateOrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, customerId, customerName, customerEmail, customerPhone, orderNote } = req.body;

    if (!amount || !customerId || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: "Required payment details (amount, customerId, customerEmail, customerPhone) are missing",
      });
    }

    const orderId = `order_${Date.now()}`;

    const orderPayload = {
      order_id: orderId,
      order_amount: Number(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_name: customerName || "Customer",
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_note: orderNote || "Payment via Mobile App",
      order_tags: {
        checkout_context: "Mobile SDK Integration"
      }
    };

    const order = await createOrderService(orderPayload);

    return res.status(201).json({
      success: true,
      data: {
        orderId: order.order_id,
        paymentSessionId: order.payment_session_id,
        cfOrder: order,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderStatusController = async (
  req: Request<{ orderId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;

    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Order ID parameter is required",
      });
    }

    const order = await getOrderService(orderId);

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const handleWebhookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("=== Cashfree Webhook Received ===");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body:", JSON.stringify(req.body, null, 2));

    return res.status(200).json({
      success: true,
      message: "Webhook received successfully",
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    next(error);
  }
};
