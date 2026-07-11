import Cookies from 'js-cookie';

import type { LoginPayload } from '../../types/AuthTypes/loginPayload.type';
import { authApi } from '../../api/auth/auth.api';

// Cấu trúc dữ liệu User trả về từ API /auth/me

export const loginAndFetchUserApi = async (payload: LoginPayload) => {
  const loginRes = await authApi.login(payload);
  const { accessToken, refreshToken } = loginRes.data;
  // Trả về cả token và thông tin user cho bước xử lý tiếp theo
  Cookies.set('refresh_token', refreshToken, {
    expires: 7,
    secure: true,
    sameSite: 'strict',
  });
  const userRes = await authApi.getProfile(accessToken);
  return {
    accessToken,
    user: userRes.data,
  };
};
