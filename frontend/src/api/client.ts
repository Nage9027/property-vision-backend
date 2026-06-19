import axios from 'axios';
import { attachInterceptors } from './interceptors';
import { getApiBaseUrl } from './baseUrl';

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

attachInterceptors(apiClient);
