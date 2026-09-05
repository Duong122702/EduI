import type { ApiResponse } from '@/schemas/response/apiResponse';
import type { ExamResponse } from '@/schemas/response/examResponse';
import axiosClient from '../config/axiosClient';
import type { ExamParamPayload } from '@/schemas/payload/examParamPayload.type';

export const getAllExamsApi = async (params: ExamParamPayload) => {
  const { page = 1, page_size = 10, ...filterParams } = params;
  const rawParams = { page, page_size, ...filterParams };

  const cleanParams = Object.fromEntries(
    Object.entries(rawParams).filter(
      ([_, value]) => value !== '' && value !== null && value !== undefined
    )
  );
  return await axiosClient.get<ApiResponse<ExamResponse>>('/exams/get_all', {
    params: cleanParams,
  });
};
