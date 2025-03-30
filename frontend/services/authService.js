 
import axios from 'axios';

export const API_URL = 'https://taskm-backend-kbth.onrender.com/api';

axios.defaults.baseURL = API_URL;

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};