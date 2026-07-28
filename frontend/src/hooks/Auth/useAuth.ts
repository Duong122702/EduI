import type { LoginPayload } from '../../schemas/payload/loginPayload.type';
import { loginApi } from '../../api/auth/login.api';
import { getProfile } from '../../api/auth/getMe.api';

// Cấu trúc dữ liệu User trả về từ API /auth/me

export const loginAndFetchUserApi = async (payload: LoginPayload) => {
  const loginRes = await loginApi(payload);
  const { access_token } = loginRes.data.data;
  const userRes = await getProfile(access_token);
  return {
    access_token,
    user: userRes.data,
  };
};
