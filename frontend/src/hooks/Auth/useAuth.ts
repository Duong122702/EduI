import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import axiosClient from '../../api/axiosClient';
import { useAuthStore } from '../../store/authStore';
import type { LoginResponse } from '../../schemas/response/loginResponse';
import type { User } from '../../Models/user.model';

// Cấu trúc dữ liệu User trả về từ API /auth/me

interface LoginPayload {
  email: string;
  password?: string;
}

const loginAndFetchUserApi = async (payload: LoginPayload) => {
  // 1. Gọi API login chung duy nhất
  const loginRes = await axiosClient.post<LoginResponse>(
    '/auth/login',
    payload
  );
  const { accessToken, refreshToken } = loginRes.data;

  // 2. Lưu trữ Refresh Token vào Cookie ngay lập tức
  Cookies.set('refresh_token', refreshToken, {
    expires: 7,
    secure: true,
    sameSite: 'strict',
  });

  // 3. Gọi API /auth/me để lấy thông tin chi tiết người dùng.
  // Gửi kèm accessToken vừa nhận được trong Header của request này.
  const userRes = await axiosClient.get<User>('/auth/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Trả về cả token và thông tin user cho bước xử lý tiếp theo
  return {
    accessToken,
    user: userRes.data,
  };
};

export const useLogin = () => {
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  return useMutation({
    mutationFn: loginAndFetchUserApi,
    onSuccess: (data) => {
      // Cập nhật cả accessToken và object User (đã có đủ id, role từ api /me) vào Zustand
      loginSuccess(data.accessToken, data.user);
    },
  });
};
