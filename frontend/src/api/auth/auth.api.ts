import type { User } from '../../Models/user.model';
import type { LoginResponse } from '../../schemas/response/loginResponse';
import type { LoginPayload } from '../../types/AuthTypes/loginPayload.type';
import axiosClient from '../axiosClient';

export const authApi = {
  login: (payload: LoginPayload) => {
    return axiosClient.post<LoginResponse>('/auth/login', payload);
  },

  getProfile: (accessToken: string) => {
    return axiosClient.get<User>('/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};
