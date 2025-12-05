import { apiClient, handleRequest } from '../../services/apiClient';

// signup new user
export const signUp = (data) => {
  return handleRequest(() => apiClient.post('/auth/signup', data));
};

// login existing user
export const login = (data) => {
  return handleRequest(() => apiClient.post('/auth/login', data));
};

// send password reset email
export const forgotPassword = (data) => {
  return handleRequest(() => apiClient.post('/auth/forgot-password', data));
};

// reset password with token
export const resetPassword = (data) => {
  return handleRequest(() => apiClient.post('/auth/reset-password', data));
};

// link google account
export const linkAccount = (data) => {
  return handleRequest(() => apiClient.post('/auth/link-account', data));
};

// complete user profile after signup
export const completeProfile = (data) => {
  return handleRequest(() => apiClient.put('/auth/complete-profile', data));
};

// get current logged in user
export const getUser = () => {
  return handleRequest(() => apiClient.get('/auth/user'));
};

// change existing password
export const changePassword = (data) => {
  return handleRequest(() => apiClient.post('/auth/change-password', data));
};

// set password google-sign in accounts
export const setPassword = (data) => {
  return handleRequest(() => apiClient.post('/auth/set-password', data));
};

// logout current user
export const logout = () => {
  return handleRequest(() => apiClient.get('/auth/logout'));
};