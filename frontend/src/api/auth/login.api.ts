import type { ApiResponse } from '../../schemas/response/apiResponse';
import type { LoginResponse } from '../../schemas/response/loginResponse';
import type { LoginPayload } from '../../schemas/payload/loginPayload.type';
import axiosClient from '../config/axiosClient';

export const loginApi = async (payload: LoginPayload) => {
  return await axiosClient.post<ApiResponse<LoginResponse>>(
    'auth/login',
    payload
  );
};
