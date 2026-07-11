import type { User } from '../../Models/user.model';
import type { ApiResponse } from '../../schemas/response/apiResponse';
import axiosClient from '../axiosClient';

export const getProfile = () => {
  return axiosClient.get<ApiResponse<User>>('/auth/me');
};
