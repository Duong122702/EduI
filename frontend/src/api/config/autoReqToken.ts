import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { refreshTokenApi } from '../auth/refresh.api';
import axiosClient from './axiosClient';
import Cookies from 'js-cookie';
import type { ApiResponse } from '../../schemas/response/apiResponse';
import type { User } from '../../Models/user.model';

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
        // Lấy refresh token từ cookie
        const refreshToken = Cookies.get('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');

        // Gửi request đổi token mới (API này nhận refresh_token và trả về cặp token mới)
        const res = await refreshTokenApi(refreshToken);
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          res.data;

        // Giải mã để cập nhật lại thông tin user vào store
        //const decoded: any = jwtDecode(newAccessToken);
        const userResponse = await axios.get<ApiResponse<User>>(
          'https://api.your-exam-domain.com/v1/auth/me',
          {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          }
        );
        const user_data = userResponse.data;
        //decoded ở đấy sẽ chứa thông tin id của user do đó không thể lưu được id vào state logiSuccess, cần phải fetch lại thông tin user từ api /me để lấy đủ thông tin id và role
        useAuthStore.getState().loginSuccess(newAccessToken, user_data.data);
        if (newRefreshToken)
          // Nếu API trả về refresh token mới, cập nhật lại cookie
          Cookies.set('refresh_token', newRefreshToken, {
            expires: 30,
            secure: true,
            sameSite: 'strict',
          });

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
