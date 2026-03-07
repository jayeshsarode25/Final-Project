import { productAPI } from './axiosInstances';

export const getProducts     = ()     => productAPI.get('/');
export const getProductById  = (id)   => productAPI.get(`/${id}`);
export const getSellerProducts = ()   => productAPI.get('/seller');

export const createProduct   = (formData) =>
  productAPI.post('/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProduct   = (id, data) => productAPI.patch(`/${id}`, data);
export const deleteProduct   = (id)       => productAPI.delete(`/${id}`);
