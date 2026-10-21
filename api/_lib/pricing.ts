export interface OrderTotals {
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
}

export function calculateOrderTotals(subtotal: number): OrderTotals {
  const shippingFee = Math.round(subtotal * 0.02);
  const tax = Math.round(subtotal * 0.2);
  return { subtotal, shippingFee, tax, total: subtotal + shippingFee + tax };
}
