import { authAPI } from './axiosInstances';

export const registerUser = (data) => authAPI.post('/register', data);
export const loginUser    = (data) => authAPI.post('/login', data);
export const getCurrentUser = ()   => authAPI.get('/me');
export const logoutUser   = ()     => authAPI.get('/logout');

// Addresses
export const getAddresses   = ()           => authAPI.get('/users/me/addresses');
export const addAddress     = (data)       => authAPI.post('/users/me/addresses', data);
export const deleteAddress  = (addressId)  => authAPI.delete(`/users/me/addresses/${addressId}`);
