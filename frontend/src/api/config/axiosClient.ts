import axios, { type AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '../../store/authStore';
import { refreshTokenApi } from '../auth/refresh.api';
import type { CustomApiError } from '../../types/exception.type';

// 1. Khởi tạo Axios Instance
const axiosClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || 'https://api.your-exam-domain.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Tự động gắn Access Token nếu chưa có
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    // Chỉ gán token nếu Zustand có token VÀ request chưa tự cài Authorization
    if (accessToken && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Xử lý Silent Refresh & Bắt lỗi tập trung
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<CustomApiError>) => {
    const apiError = error.response?.data;
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(apiError || error);
    }

    // Xử lý khi gặp lỗi 401 (Unauthorized)
    if (error.response?.status === 401 && !(originalRequest as any)._retry) {
      const isAuthRequest =
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/login');

      // Nếu chính request login hoặc refresh bị 401 -> Logout ngay, tránh vòng lặp
      if (isAuthRequest) {
        useAuthStore.getState().logout();
        return Promise.reject(apiError || error);
      }

      // Hàng đợi cho các request đến sau trong lúc đang Refresh
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      (originalRequest as any)._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');

        // Gọi API cấp lại Access Token mới
        const res = await refreshTokenApi();
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          res.data;

        // Cập nhật State Zustand
        useAuthStore.setState((state) => ({
          ...state,
          accessToken: newAccessToken,
          isAuthenticated: true,
        }));

        if (newRefreshToken) {
          Cookies.set('refresh_token', newRefreshToken, {
            expires: 30,
            secure: true,
            sameSite: 'strict',
          });
        }

        processQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    // Trả về object CustomApiError chuẩn cho các component/query
    return Promise.reject(apiError || error);
  }
);

export default axiosClient;
