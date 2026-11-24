import { extractExamPdfApi } from '@/api/exam/extractExamPdf.api';
import { useMutation } from '@tanstack/react-query';

export const useExtractPdf = () => {
  return useMutation({
    mutationFn: (file: File) => extractExamPdfApi(file),
    onError: (error: any) => {
      const msg = error?.message || 'Có lỗi khi trích xuất đề thi từ PDF';
      console.error(msg);
    },
  });
};
