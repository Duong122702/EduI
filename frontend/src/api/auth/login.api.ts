import type { ApiResponse } from '../../schemas/response/apiResponse';
import type { LoginResponse } from '../../schemas/response/loginResponse';
import type { LoginPayload } from '../../types/AuthTypes/loginPayload.type';
import axiosClient from '../axiosClient';

export const loginApi = (payload: LoginPayload) => {
  return axiosClient.post<ApiResponse<LoginResponse>>('/login', payload);
};
