import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
  fullName: Yup.string().required('Họ và tên là bắt buộc'),
  email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: Yup.string()
    .min(8, 'Mật khẩu phải từ 8 ký tự')
    .required('Mật khẩu là bắt buộc'),
  acceptTerms: Yup.boolean().oneOf(
    [true],
    'Bạn phải đồng ý với điều khoản dịch vụ'
  ),
});
