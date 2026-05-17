import config from '../config/config.js';

/** Deep link / web path customers use to open in-app tracking. */
export function buildOrderTrackingUrl(orderId: string): string {
  const base = process.env.CUSTOMER_TRACKING_URL_BASE?.trim();
  if (base) {
    return `${base.replace(/\/$/, '')}/${orderId}`;
  }
  if (config.NODE_ENV === 'production') {
    return `zimcart://track/${orderId}`;
  }
  return `zimcart://track/${orderId}`;
}
