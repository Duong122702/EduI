import * as Yup from 'yup';

export const addFormSchema = Yup.object().shape({
  subject: Yup.string().min(1, 'Vui lòng chọn bộ môn'),
  topic: Yup.string().optional(),
  level: Yup.string().min(1, 'Vui lòng chọn độ khó'),
  questionType: Yup.string().min(1, 'Vui lòng chọn kiểu câu hỏi'),
  content: Yup.string().min(1, 'Nội dung đề bài không được để trống'),
  correct_answer: Yup.string().min(1, 'Đáp án đúng không được để trống'),
  options: Yup.object({
    A: Yup.string().required('Vui lòng nhập lựa chọn A'),
    B: Yup.string().required('Vui lòng nhập lựa chọn B'),
    C: Yup.string().required('Vui lòng nhập lựa chọn C'),
    D: Yup.string().required('Vui lòng nhập lựa chọn D'),
  }).optional(),
  explanation: Yup.string().optional(),
  questionNumber: Yup.number().optional(),
  scoreWeight: Yup.number().required('Vui lòng nhập số điểm'),
});
export type QuestionFormAddValue = Yup.InferType<typeof addFormSchema>;
