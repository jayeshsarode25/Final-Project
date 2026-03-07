import { cartAPI } from './axiosInstances';

export const getCart           = ()                    => cartAPI.get('/');
export const addItemToCart     = (data)                => cartAPI.post('/items', data);
export const updateCartItem   = (productId, data)     => cartAPI.patch(`/items/${productId}`, data);
