import type { Request, Response, NextFunction } from "express";
import { createOrderService, getOrderService, getPaymentService } from "@/services/cashfree.service";
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
      },
      ...(process.env.CASHFREE_NOTIFY_URL && {
        order_meta: {
          notify_url: process.env.CASHFREE_NOTIFY_URL,
        },
      }),
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

export const getPaymentStatusController = async (
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

    const payment = await getPaymentService(orderId);

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const getUnifiedStatusController = async (
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

    // ONLY fetch payments — this is all you need!
    const paymentsData = await getPaymentService(orderId);
    const payments = Array.isArray(paymentsData) ? paymentsData : [];

    // Case 1: No payment attempt was made
    if (payments.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          orderId,
          status: "FAILED",
          isPaid: false,
          message: "No payment attempt was found.",
        },
      });
    }

    // Case 2: SUCCESS
    const successfulPayment = payments.find((p: any) => p.payment_status === "SUCCESS");
    if (successfulPayment) {
      return res.status(200).json({
        success: true,
        data: {
          orderId,
          status: "SUCCESS",
          isPaid: true,
          amount: successfulPayment.payment_amount,
          cfPaymentId: successfulPayment.cf_payment_id,
          bankReference: successfulPayment.bank_reference,
          message: "Payment completed successfully!",
        },
      });
    }

    // Case 3: PENDING (Money debited, awaiting bank clearance)
    const pendingPayment = payments.find((p: any) => p.payment_status === "PENDING");
    if (pendingPayment) {
      return res.status(200).json({
        success: true,
        data: {
          orderId,
          status: "PENDING",
          isPaid: false,
          amount: pendingPayment.payment_amount,
          message: "Payment is pending with the bank. If debited, it will reflect shortly.",
        },
      });
    }

    // Case 4: USER_DROPPED (User cancelled in SDK/UPI app)
    const latestPayment = payments[payments.length - 1];
    if (latestPayment?.payment_status === "USER_DROPPED") {
      return res.status(200).json({
        success: true,
        data: {
          orderId,
          status: "USER_DROPPED",
          isPaid: false,
          message: "Payment was cancelled.",
        },
      });
    }

    // Case 5: FAILED (Declined, insufficient funds, etc.)
    return res.status(200).json({
      success: true,
      data: {
        orderId,
        status: "FAILED",
        isPaid: false,
        message: latestPayment?.error_details?.error_description || "Payment failed. Please try again.",
      },
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
