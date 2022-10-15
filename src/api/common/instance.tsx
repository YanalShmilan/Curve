import axios from 'axios';
const instance = axios.create({
  withCredentials: false,
  baseURL: process.env.REACT_APP_BACKEND_URL + '/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
