import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuestionApi } from '@/api/question/deleteQuestion.api';
import type { AxiosError } from 'axios';

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteQuestionApi(id),
    onSuccess: () => {
      // Refresh lại danh sách
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      //   alert('Xóa câu hỏi thành công!');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data.message || 'Có lỗi xảy ra khi xóa';
      alert(errorMessage);
    },
  });
};
