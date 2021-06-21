import axios from 'axios';
import Cookie from 'universal-cookie';

import services from '../../config/services';

const api = axios.create({
  baseURL: services.api_url,
});

api.interceptors.request.use(
  config => {
    const cookie = new Cookie();
    const token = cookie.get<string>('@edu/rss-reader:token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;
