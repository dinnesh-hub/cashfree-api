export interface CustomerDetails {
  customer_id: string;
  customer_name?: string;
  customer_email: string;
  customer_phone: string;
}

export interface CreateOrderPayload {
  order_id: string;
  order_amount: number;
  order_currency: string;
  customer_details: CustomerDetails;
  order_note?: string;
  order_tags?: Record<string, string>;
  order_meta?: {
    return_url?: string;
    notify_url?: string;
    payment_methods?: string;
  };
}

export interface CreateOrderRequestBody {
  amount: number;
  customerId: string;
  customerName?: string;
  customerEmail: string;
  customerPhone: string;
  orderNote?: string;
}
