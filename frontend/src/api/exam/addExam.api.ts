import type { addExamFormSchemaType } from '@/features/examroom/schemas/AddExamForm.schema';
import axiosClient from '../config/axiosClient';
import type { ApiResponse } from '@/schemas/response/apiResponse';

export const addExamApi = async (examData: addExamFormSchemaType) => {
  const payload = {
    ...examData,
    extraction_id: examData.extraction_id || null,
  };
  return await axiosClient.post<ApiResponse<string>>('/exams/create', payload);
};
