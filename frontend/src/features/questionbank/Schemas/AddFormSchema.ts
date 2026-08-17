// src/features/questionbank/Schemas/AddFormSchema.ts
import * as Yup from 'yup';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const fileSchema = Yup.mixed<File>()
  .nullable()
  .optional()
  .test('fileSize', 'Dung lượng ảnh không quá 5MB', (file) => {
    if (!file || !(file instanceof File)) return true;
    return file.size <= MAX_FILE_SIZE;
  })
  .test(
    'fileType',
    'Định dạng ảnh không hợp lệ (hỗ trợ jpg, png, webp)',
    (file) => {
      if (!file || !(file instanceof File)) return true;
      return SUPPORTED_FORMATS.includes(file.type);
    }
  );

const singleOptionSchema = Yup.object().shape({
  content: Yup.string().optional(),
  image_file: fileSchema,
});

export const addFormSchema = Yup.object().shape({
  subject: Yup.string().required('Vui lòng chọn bộ môn'),
  topic: Yup.string().optional(),
  level: Yup.string().required('Vui lòng chọn độ khó'),
  questionType: Yup.string().required('Vui lòng chọn kiểu câu hỏi'),
  content: Yup.string().required('Nội dung đề bài không được để trống'),

  // 👉 Thêm trường ảnh cho đề bài
  question_image_file: fileSchema,

  correct_answer: Yup.string().required('Đáp án đúng không được để trống'),
  options: Yup.object({
    A: singleOptionSchema,
    B: singleOptionSchema,
    C: singleOptionSchema,
    D: singleOptionSchema,
  }).optional(),
  explanation: Yup.string().optional(),
  sourceLabel: Yup.string().optional(),
  scoreWeight: Yup.number().required('Vui lòng nhập số điểm'),
});

export type QuestionFormAddValue = Yup.InferType<typeof addFormSchema>;
