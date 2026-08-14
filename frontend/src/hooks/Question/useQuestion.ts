// src/hooks/question/useQuestions.ts
import { getAllQuestions } from '@/api/question/getAll.api';
import { getMostSubject } from '@/api/question/getmostSubject.api';
import type { GetQuestionsParams } from '@/schemas/payload/questionParamPayload.type';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useQuestions = (
  params: GetQuestionsParams = { page: 1, page_size: 10 }
) => {
  const questionsQuery = useQuery({
    // queryKey chứa page và pageSize để tự động refetch khi người dùng đổi trang
    queryKey: ['questions', params],

    // Gọi API service
    queryFn: () => getAllQuestions(params),

    // Giữ lại dữ liệu trang cũ trong lúc đang tải dữ liệu trang mới (tránh bị chớp màn hình)
    placeholderData: keepPreviousData,

    // Tùy chọn: Thời gian cache dữ liệu (ví dụ: 5 phút)
    staleTime: 5 * 60 * 1000,
  });

  const questionsGetMostSubject = useQuery({
    queryKey: ['subject', 'top-most-subject'],
    queryFn: getMostSubject,
    staleTime: 10 * 60 * 1000,
  });
  return {
    data: questionsQuery.data,
    isPending: questionsQuery.isPending,
    most_subject_data: questionsGetMostSubject.data,
  };
};
