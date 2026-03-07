import { orderAPI } from './axiosInstances';

export const createOrder      = (data)   => orderAPI.post('/', data);
export const getMyOrders      = ()       => orderAPI.get('/me');
export const getOrderById     = (id)     => orderAPI.get(`/${id}`);
export const cancelOrder      = (id)     => orderAPI.post(`/${id}/cancel`);
export const updateOrderAddress = (id, data) => orderAPI.patch(`/${id}/address`, data);
