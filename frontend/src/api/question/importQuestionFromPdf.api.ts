import axiosClient from '../config/axiosClient';
import type { ApiResponse } from '@/schemas/response/apiResponse';

export const importQuestionsFromPdfApi = async (
  file: File,
  subject: string,
  level: string
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('subject', subject);
  formData.append('level', level);

  return await axiosClient.post<ApiResponse<string>>(
    '/questions/import-pdf',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};
