import { getAllExamsApi } from '@/api/exam/getAllExams.api';
import type { ExamParamPayload } from '@/schemas/payload/examParamPayload.type';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useExams = (
  params: ExamParamPayload = { page: 1, page_size: 10 }
) => {
  const examsQuery = useQuery({
    queryKey: ['exams', params],
    queryFn: () => getAllExamsApi(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
  return { data: examsQuery.data?.data.data, isPending: examsQuery.isPending };
};
