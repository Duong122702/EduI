import axiosClient from '../config/axiosClient';
import type { ApiResponse } from '@/schemas/response/apiResponse';
import type { ExtractionResult } from '@/api/exam/extractExamPdf.api';

export const extractQuestionsFromPdfApi = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return await axiosClient.post<ApiResponse<ExtractionResult>>(
    '/questions/extract-pdf',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};

export const confirmImportQuestionsApi = async (extractionId: string) => {
  return await axiosClient.post<ApiResponse<string>>(
    '/questions/confirm-import',
    { extraction_id: extractionId },
  );
};
