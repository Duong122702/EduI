import { addExamApi } from '@/api/exam/addExam.api';
import type { addExamFormSchemaType } from '@/features/examroom/schemas/AddExamForm.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export const useAddExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: addExamFormSchemaType) => addExamApi(data),
    onSuccess: () => {
      //toast
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = error.response?.data.message || 'Có lỗi xảy ra';
      console.log(errorMessage);
      //toast
    },
  });
};
