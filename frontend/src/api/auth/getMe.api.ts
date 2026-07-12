import type { User } from '../../Models/user.model';
import type { ApiResponse } from '../../schemas/response/apiResponse';
import axiosClient from '../config/axiosClient';

export const getProfile = async () => {
  return await axiosClient.get<ApiResponse<User>>('/auth/me');
};
