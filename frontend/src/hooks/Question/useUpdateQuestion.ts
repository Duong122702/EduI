import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQuestionApi } from '@/api/question/updateQuestion.api';
import type { QuestionFormAddValue } from '@/features/questionbank/Schemas/AddFormSchema';
import type { AxiosError } from 'axios';

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: QuestionFormAddValue }) =>
      updateQuestionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data.message || 'Có lỗi xảy ra khi cập nhật';
      alert(errorMessage);
    },
  });
};
