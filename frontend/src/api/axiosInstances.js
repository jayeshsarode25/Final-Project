import axios from 'axios';
import { API_BASE } from '../utils/constants';

function createInstance(baseURL) {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  });

  // Response interceptor — unwrap errors
  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      const message =
        error.response?.data?.errors?.map((e) => e.msg).join(', ') ||
        error.response?.data?.message ||
        error.message ||
        'Something went wrong';
      return Promise.reject({ message, status: error.response?.status });
    }
  );

  return instance;
}

export const authAPI    = createInstance(API_BASE.AUTH);
export const productAPI = createInstance(API_BASE.PRODUCT);
export const cartAPI    = createInstance(API_BASE.CART);
export const orderAPI   = createInstance(API_BASE.ORDER);
export const paymentAPI = createInstance(API_BASE.PAYMENT);
export const sellerAPI  = createInstance(API_BASE.SELLER);
