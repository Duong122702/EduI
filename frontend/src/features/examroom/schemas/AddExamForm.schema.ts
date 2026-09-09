import * as yup from 'yup';
export const addExamFormSchema = yup.object().shape({
  title: yup.string().required('Tên đề thi là bắt buộc'),
  description: yup.string().optional(),
  duration: yup.number().required('Thời gian làm bài là bắt buộc').min(50),
  subject: yup.string().required('Môn học là bắt buộc'),
  status: yup.string().required('Trạng thái là bắt buộc'),
  question_ids: yup.array().of(yup.string()).optional(),
});

export type addExamFormSchemaType = yup.InferType<typeof addExamFormSchema>;
