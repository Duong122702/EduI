import axiosClient from '../config/axiosClient';
import type { ApiResponse } from '@/schemas/response/apiResponse';

export interface ExtractedQuestion {
  content: string;
  question_type: string;
  options: Record<string, { content: string; image_url: string | null }> | null;
  image_url: string | null;
  source_label: string;
  score_weight: number;
  is_passage: boolean;
  temp_id: string | null;
  temp_parent_id: string | null;
}

export interface ExtractionResult {
  extraction_id: string;
  exam_metadata: {
    exam_name: string;
    subject: string;
    routing_group: string;
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
