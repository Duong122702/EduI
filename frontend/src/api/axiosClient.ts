import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { jwtDecode } from 'jwt-decode'; // Cài đặt qua: npm install jwt-decode

const axiosClient = axios.create({
  baseURL: 'https://api.your-exam-domain.com/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor: Đính kèm Access Token vào mọi request gửi đi
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý Silent Refresh khi gặp lỗi 401
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) =>
    error ? prom.reject(error) : prom.resolve(token)
  );
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu mã lỗi 401 và request này chưa từng thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');

        // Gửi request đổi token mới (API này nhận refresh_token và trả về cặp token mới)
        const res = await axios.post(
          'https://api.your-exam-domain.com/v1/auth/refresh',
          { refreshToken }
        );
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          res.data;

        // Giải mã để cập nhật lại thông tin user vào store
        const decoded: any = jwtDecode(newAccessToken);

        useAuthStore.getState().loginSuccess(newAccessToken, decoded);
        if (newRefreshToken)
          localStorage.setItem('refresh_token', newRefreshToken);

        processQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        useAuthStore.getState().logout(); // Refresh token hết hạn hoặc bị xóa ở DB -> Logout luôn
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
