import axios from 'axios';
import services from '../config/services';

const api = axios.create({
  baseURL: services.api_url,
  headers: {
    'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.Njk.eMahrPJR5GvgDLef44IoLiFWsru3vPE-Y5y9OQR5Xbs`
  }
});

export default api;
