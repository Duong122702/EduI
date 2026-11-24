import axiosClient from '../config/axiosClient';
import type { ApiResponse } from '@/schemas/response/apiResponse';

export interface ExtractedQuestion {
  content: string;
  questionType: string;
  options: Record<string, { content: string; imageUrl: string | null }> | null;
  imageUrl: string | null;
  sourceLabel: string;
  scoreWeight: number;
  isPassage: boolean;
  tempId: string | null;
  tempParentId: string | null;
}

export interface ExtractionResult {
  extractionId: string;
  examMetadata: {
    examName: string;
    subject: string;
    routingGroup: string;
  };
  questions: ExtractedQuestion[];
}

export const extractExamPdfApi = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return await axiosClient.post<ApiResponse<ExtractionResult>>(
    '/exams/extract-pdf',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};
