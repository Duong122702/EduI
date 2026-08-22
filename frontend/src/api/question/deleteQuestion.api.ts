import axiosClient from '../config/axiosClient';
import type { ApiResponse } from '@/schemas/response/apiResponse';

export const deleteQuestionApi = async (id: string) => {
  return await axiosClient.delete<ApiResponse<string>>(`/questions/${id}`);
};
