import type { QuestionFormAddValue } from '@/features/questionbank/Schemas/AddFormSchema';
import axiosClient from '../config/axiosClient';
import type { ApiResponse } from '@/schemas/response/apiResponse';

export const addQuestionApi = async (questionData: QuestionFormAddValue) => {
  return await axiosClient.post<ApiResponse<string>>(
    '/questions/add',
    questionData
  );
};
