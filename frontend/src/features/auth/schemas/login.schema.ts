import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: Yup.string()
    .min(8, 'Mật khẩu phải từ 8 ký tự')
    .required('Mật khẩu là bắt buộc'),
  acceptTerms: Yup.boolean().oneOf([true], 'Bạn đồng ý duy trì đăng nhập'),
});

export type UserFormLoginValues = Yup.InferType<typeof loginSchema>;
