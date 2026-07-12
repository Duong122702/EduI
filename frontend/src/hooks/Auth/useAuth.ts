import Cookies from 'js-cookie';

import type { LoginPayload } from '../../types/AuthTypes/loginPayload.type';
import { loginApi } from '../../api/auth/login.api';
import { getProfile } from '../../api/auth/getMe.api';

// Cấu trúc dữ liệu User trả về từ API /auth/me

export const loginAndFetchUserApi = async (payload: LoginPayload) => {
  const loginRes = await loginApi(payload);
  const { accessToken, refreshToken } = loginRes.data.data;
  // Trả về cả token và thông tin user cho bước xử lý tiếp theo
  Cookies.set('refresh_token', refreshToken, {
    expires: 30,
    secure: true,
    sameSite: 'strict',
  });
  const userRes = await getProfile();
  return {
    accessToken,
    user: userRes.data,
  };
};
