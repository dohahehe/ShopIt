export interface ShippingAddress {
    details: string;
    phone: string;
    city: string;
}

export interface CreateCashOrderParams {
    cartId: string;
    shippingAddress: ShippingAddress;
}

export interface CreateCheckoutSessionParams {
    cartId: string;
    shippingAddress: ShippingAddress;
    returnUrl?: string; 
}

export interface OrderItem {
  _id: string
  product: {
    _id: string
    title: string
    imageCover: string
    price: number
    category?: {
      name: string
    }
  }
  count: number
  price: number
}

export interface Order {
  _id: string
  user: {
    name: string
    email: string
  }
  cartItems: OrderItem[]
  shippingAddress: {
    details: string
    city: string
    phone: string
  }
  taxPrice: number
  shippingPrice: number
  totalOrderPrice: number
  paymentMethodType: 'cash' | 'card'
  isPaid: boolean
  isDelivered: boolean
  paidAt?: string
  createdAt: string
}

export type OrdersResponse = Order[] | { success: boolean; results: number; data: Order[] }
