import * as Yup from 'yup';

export const addFormSchema = Yup.object().shape({
  subject: Yup.string().min(1, 'Vui lòng chọn bộ môn'),
  topic: Yup.string().optional(),
  difficulty: Yup.string().min(1, 'Vui lòng chọn độ khó'),
  type: Yup.string().min(1, 'Vui lòng chọn kiểu câu hỏi'),
  content: Yup.string().min(1, 'Nội dung đề bài không được để trống'),
});

export type UserFormAddValue = Yup.InferType<typeof addFormSchema>;
