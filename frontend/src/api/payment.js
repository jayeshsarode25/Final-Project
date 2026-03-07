import { paymentAPI } from './axiosInstances';

export const createPayment = (orderId)  => paymentAPI.post(`/create/${orderId}`);
export const verifyPayment = (data)     => paymentAPI.post('/verify', data);
