import {
  confirmImportQuestionsApi,
  extractQuestionsFromPdfApi,
} from '@/api/question/importQuestionFromPdf.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useExtractQuestionsPdf = () => {
  return useMutation({
    mutationFn: (file: File) => extractQuestionsFromPdfApi(file),
    onError: (error: any) => {
      const msg = error?.message || 'Có lỗi khi trích xuất câu hỏi từ PDF';
      console.error(msg);
    },
  });
};

export const useConfirmImport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (extractionId: string) =>
      confirmImportQuestionsApi(extractionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: (error: any) => {
      const msg = error?.message || 'Có lỗi khi lưu câu hỏi';
      console.error(msg);
    },
  });
};
