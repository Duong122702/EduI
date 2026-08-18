import { importQuestionsFromPdfApi } from '@/api/question/importQuestionFromPdf.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export const useImportPdf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      subject,
      level,
    }: {
      file: File;
      subject: string;
      level: string;
    }) => importQuestionsFromPdfApi(file, subject, level),
    onSuccess: () => {
      // Refresh lại danh sách câu hỏi trong bảng
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      alert('Import PDF thành công!');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data.message || 'Có lỗi xảy ra khi import PDF';
      alert(errorMessage);
    },
  });
};
