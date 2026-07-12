import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://api.your-exam-domain.com/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor: Đính kèm Access Token vào mọi request gửi đi

export default axiosClient;
