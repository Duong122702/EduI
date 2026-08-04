import type { ApiResponse } from '@/schemas/response/apiResponse';
import axiosClient from '../config/axiosClient';
import type { QuestionResponse } from '@/schemas/response/questionResponse';
import type { GetQuestionsParams } from '@/schemas/payload/questionParamPayload.type';

export const getAllQuestions = async (params: GetQuestionsParams) => {
  const { page = 1, page_size = 10, ...filterParams } = params;

  const rawParams = { page, page_size, ...filterParams };

  const cleanParams = Object.fromEntries(
    Object.entries(rawParams).filter(
      ([_, value]) => value !== '' && value !== null && value !== undefined
    )
  );
  return await axiosClient.get<ApiResponse<QuestionResponse>>(
    '/questions/get_all',
    {
      params: cleanParams,
    }
  );
};
