import axios from 'axios';

const raw = process.env.REACT_APP_API_URL;

const base =
  typeof raw === 'string' && (raw.startsWith('http://') || raw.startsWith('https://'))
    ? raw
    : `http://${raw}`;

const axiosInstance = axios.create({
  baseURL: base + '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance