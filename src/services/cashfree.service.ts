import { cashfreeClient } from "@/config/cashfree.config";
import type { CreateOrderPayload } from "@/types/payment.types";

export const createOrderService = async (orderData: CreateOrderPayload) => {
  const response = await cashfreeClient.PGCreateOrder(orderData as any);
  return response.data;
};

export const getOrderService = async (orderId: string) => {
  const response = await cashfreeClient.PGFetchOrder(orderId);
  return response.data;
};

export const getPaymentService = async (orderId: string) => {
  const response = await cashfreeClient.PGOrderFetchPayments(orderId);
  return response.data;
}
