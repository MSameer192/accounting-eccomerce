// axios-config.js

import axios from 'axios';
import { getAuthToken } from './auth'; // Import the functions to set and retrieve the JWT token

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // Replace with your API URL
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
