import type { SubjectResponse } from '@/schemas/response/subjectResponse';
import axiosClient from '../config/axiosClient';
import type { ApiResponse } from '@/schemas/response/apiResponse';

export const getMostSubject = async () => {
  return await axiosClient.get<ApiResponse<SubjectResponse>>(
    '/questions/getMostSubject'
  );
};
