import type { addExamFormSchemaType } from '@/features/examroom/schemas/AddExamForm.schema';
import axiosClient from '../config/axiosClient';
import type { ApiResponse } from '@/schemas/response/apiResponse';

export const addExamApi = async (examData: addExamFormSchemaType) => {
  return await axiosClient.post<ApiResponse<string>>('/api/exams', examData);
};
