import axios from 'axios';

export const VIBECART_URI = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5001`;

axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const API = {
  validateAccount: `${VIBECART_URI}/api/v1/vibe-cart/accounts/validate`,
  users:           `${VIBECART_URI}/api/v1/vibe-cart/accounts/users`,
  user:            (id) => `${VIBECART_URI}/api/v1/vibe-cart/accounts/user/${id}`,
  createUser:      `${VIBECART_URI}/api/v1/vibe-cart/accounts/user`,
  customers:       `${VIBECART_URI}/api/v1/vibe-cart/accounts/customers`,
  customer:        (id) => `${VIBECART_URI}/api/v1/vibe-cart/accounts/customer/${id}`,
  createCustomer:  `${VIBECART_URI}/api/v1/vibe-cart/accounts/customer`,
};
