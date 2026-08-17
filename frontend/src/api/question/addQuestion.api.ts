import type { QuestionFormAddValue } from '@/features/questionbank/Schemas/AddFormSchema';
import axiosClient from '../config/axiosClient';
import type { ApiResponse } from '@/schemas/response/apiResponse';

export const addQuestionApi = async (questionData: QuestionFormAddValue) => {
  console.log('questionData options:', questionData.options);
  const formData = new FormData();
  // 1. Thêm các trường thông tin cơ bản
  formData.append('subject', questionData.subject);
  formData.append('level', questionData.level || 'Nhận biết');
  formData.append('question_type', questionData.questionType);
  formData.append('content', questionData.content);
  formData.append('correct_answer', questionData.correct_answer);

  // 👉 Append ảnh câu hỏi (nếu có)
  if (questionData.question_image_file instanceof File) {
    formData.append('question_image', questionData.question_image_file);
  }
  if (questionData.topic) {
    formData.append('topic', questionData.topic);
  }
  if (questionData.explanation) {
    formData.append('explanation', questionData.explanation);
  }
  if (questionData.sourceLabel !== undefined) {
    formData.append('source_label', String(questionData.sourceLabel));
  }
  if (questionData.scoreWeight !== undefined) {
    formData.append('score_weight', String(questionData.scoreWeight));
  }

  // 2. Đóng gói các lựa chọn (A, B, C, D)
  if (questionData.options) {
    (['A', 'B', 'C', 'D'] as const).forEach((key) => {
      const option = questionData.options?.[key];
      if (option) {
        // Gửi nội dung text của đáp án
        if (option.content) {
          formData.append(`option_${key}_content`, option.content);
        }

        // Gửi file ảnh trực tiếp (nếu có)
        if (option.image_file instanceof File) {
          formData.append(`option_${key}_image`, option.image_file);
        }
      }
    });
  }
  return await axiosClient.post<ApiResponse<string>>(
    '/questions/add',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};
