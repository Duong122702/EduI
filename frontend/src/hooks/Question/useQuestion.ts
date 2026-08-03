// src/hooks/question/useQuestions.ts
import { getAllQuestions } from '@/api/question/getAll.api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useQuestions = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    // queryKey chứa page và pageSize để tự động refetch khi người dùng đổi trang
    queryKey: ['questions', page, pageSize],

    // Gọi API service
    queryFn: () => getAllQuestions(page, pageSize),

    // Giữ lại dữ liệu trang cũ trong lúc đang tải dữ liệu trang mới (tránh bị chớp màn hình)
    placeholderData: keepPreviousData,

    // Tùy chọn: Thời gian cache dữ liệu (ví dụ: 5 phút)
    staleTime: 5 * 60 * 1000,
  });
};
