import * as Yup from 'yup';

export const addFormSchema = Yup.object().shape({
  subject: Yup.string().min(1, 'Vui lòng chọn bộ môn'),
  topic: Yup.string().optional(),
  level: Yup.string().min(1, 'Vui lòng chọn độ khó'),
  type: Yup.string().min(1, 'Vui lòng chọn kiểu câu hỏi'),
  content: Yup.string().min(1, 'Nội dung đề bài không được để trống'),
  correct_answer: Yup.string().min(1, 'Đáp án đúng không được để trống'),
  options: Yup.object({
    A: Yup.string().required('Vui lòng nhập lựa chọn A'),
    B: Yup.string().required('Vui lòng nhập lựa chọn B'),
    C: Yup.string().required('Vui lòng nhập lựa chọn C'),
    D: Yup.string().required('Vui lòng nhập lựa chọn D'),
  }).optional(),
  explanation: Yup.string().optional(),
});
export type QuestionFormAddValue = Yup.InferType<typeof addFormSchema>;
