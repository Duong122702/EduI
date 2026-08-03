import type { ApiResponse } from '@/schemas/response/apiResponse';
import axiosClient from '../config/axiosClient';
import type { QuestionResponse } from '@/schemas/response/questionResponse';

export const getAllQuestions = async (
  page: number = 1,
  page_size: number = 10
) => {
  return await axiosClient.get<ApiResponse<QuestionResponse>>(
    '/questions/get_all',
    {
      params: {
        page,
        page_size,
      },
    }
  );
};
