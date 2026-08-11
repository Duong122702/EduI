import { addQuestionApi } from '@/api/question/addQuestion.api';
import type { QuestionFormAddValue } from '@/features/questionbank/Schemas/AddFormSchema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export const useAddQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QuestionFormAddValue) => addQuestionApi(data),
    onSuccess: () => {
      //toast
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = error.response?.data.message || 'Có lỗi xảy ra';
      console.log(errorMessage);
      //toast
    },
  });
};
