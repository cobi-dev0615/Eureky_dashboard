import { apiClient } from './api';

export const paymentsService = {
  async createCheckoutSession(packageId, userId, paymentType) {
    return await apiClient.post('/payments/create-checkout-session', {
      packageId,
      userId,
      paymentType,
      successUrl: window.location.origin + '/payments/checkout?success=true',
      cancelUrl: window.location.origin + '/payments/checkout?cancel=true'
    }, {
      credentials: 'include'
    });
  },
  async verifyPayment(sessionId) {
    return await apiClient.post('/payments/verify-session', {
      sessionId
    }, {
      credentials: 'include'
    });
  }
};