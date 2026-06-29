import { useState } from 'react';
import Button from '../../../components/ui/Button';
import { CustomIcon } from '../../../components/ui/CustomIcon';
import { Input } from '../../../components/ui/Input';
import type { RegisterProps } from '../../../types/AuthTypes/register.type';
import {
  registerSchema,
  type UserFormRegisterValues,
} from '../schemas/register.schema';
import * as Yup from 'yup';

function Register({ currentTab, handleRoleChange, isSelect }: RegisterProps) {
  const [registerFormData, setRegisterFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    acceptTerm: false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormRegisterValues, string>>
  >({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name as keyof UserFormRegisterValues]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const dataToValidate: UserFormRegisterValues = {
      ...registerFormData,
      role: isSelect ? 'student' : 'teacher',
    };

    try {
      await registerSchema.validate(dataToValidate, { abortEarly: false });
      setErrors({});

      console.log('call API');
    } catch (yupError) {
      if (yupError instanceof Yup.ValidationError) {
        const newErrors: Partial<Record<keyof UserFormRegisterValues, string>> =
          {};
        yupError.inner.forEach((validationError) => {
          if (validationError.path)
            [
              (newErrors[validationError.path as keyof UserFormRegisterValues] =
                validationError.message),
            ];
        });
        setErrors(newErrors);
        // UI Trượt lên cho form quá dài
        // const firstErrorKey = Object.keys(newErrors)[0];
        // const errorElement = document.getElementsByName(firstErrorKey)[0];
        // if (errorElement) {
        //   errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // }
      }
    }
  };
  return (
    <div className={`${currentTab === 'regis' ? 'block' : 'hidden'} mt-8`}>
      <div className="mb-5">
        <span className="text-xs leading-relaxed font-bold text-gray-500 uppercase">
          Bạn đăng ký với vai trò
        </span>
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`${isSelect ? 'border-primary' : 'border-gray-300 hover:border-gray-400'} relative cursor-pointer rounded-xl border-2 p-3 text-center transition-all duration-300`}
            onClick={handleRoleChange}
          >
            <div
              className={`${isSelect ? 'block' : 'hidden'} text-primary-dark absolute top-2 right-2`}
            >
              <CustomIcon name="iconCheck" />
            </div>
            <CustomIcon
              name="logo"
              className={`${isSelect ? 'text-primary-dark' : 'text-gray-400'} mx-auto mb-2 h-6 w-6`}
            />
            <p
              className={`${isSelect ? '' : 'text-gray-400'} text-center text-xs leading-relaxed font-semibold`}
            >
              Học viên / Thí sinh
            </p>
          </div>
          <div
            className={`${!isSelect ? 'border-primary' : 'border-gray-300 hover:border-gray-400'} relative cursor-pointer rounded-xl border-2 p-3 text-center transition-all duration-300`}
            onClick={handleRoleChange}
          >
            <div
              className={`${!isSelect ? 'block' : 'hidden'} text-primary-dark absolute top-2 right-2`}
            >
              <CustomIcon name="iconCheck" />
            </div>
            <CustomIcon
              name="iconRepresent"
              className={`${!isSelect ? 'text-primary-dark' : 'text-gray-300'} mx-auto mb-2 h-6 w-6`}
            />
            <p
              className={`${!isSelect ? '' : 'text-gray-400'} text-center text-xs leading-relaxed font-semibold`}
            >
              Giảng viên / Soạn đề
            </p>
          </div>
        </div>
      </div>
      <div className="mb-5">
        <span className="text-xs leading-relaxed font-bold text-gray-500 uppercase">
          Họ và tên
        </span>
        <div className="relative mt-2">
          <CustomIcon
            name="iconAvatar"
            className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
          />
          <Input
            type="email"
            inputSize={'md'}
            className={`bg-white px-10 ${errors.fullName ? 'focus:boder-red-500! border-red-500' : ''}`}
            placeholder="Nguyễn Văn A"
          />
        </div>
        {errors.fullName && (
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
            ⚠️ {errors.fullName}
          </p>
        )}
      </div>
      <div className="mb-5">
        <span className="text-xs leading-relaxed font-bold text-gray-500 uppercase">
          Địa chỉ email
        </span>
        <div className="relative mt-2">
          <CustomIcon
            name="badgeLetter"
            className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
          />
          <Input
            type="email"
            inputSize={'md'}
            className={`bg-white px-10 ${errors.email ? 'focus:boder-red-500! border-red-500' : ''}`}
            placeholder="exemple@example.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
            ⚠️ {errors.email}
          </p>
        )}
      </div>
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <span className="text-xs leading-relaxed font-bold text-gray-500 uppercase">
            Thiết lập mật khẩu
          </span>
        </div>
        <div className="relative mt-2">
          <CustomIcon
            name="iconLock"
            className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
          />
          <Input
            type="password"
            inputSize={'md'}
            className={`items-center bg-white px-10 ${errors.password ? 'focus:boder-red-500! border-red-500' : ''}`}
            placeholder="••••••••"
          />
          <div className="cursor-pointer">
            <CustomIcon
              name="iconEyes"
              className="hover:text-primary absolute top-1/2 right-4 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
        {errors.password && (
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
            ⚠️ {errors.password}
          </p>
        )}
      </div>
      <div className="mb-5 flex items-center justify-start gap-2">
        <input type="checkbox" className="h-4 w-4" />
        <span className="text-xs text-gray-800">
          Tôi đồng ý với
          <a
            href="#"
            className="text-primary-dark mx-1 font-semibold hover:underline"
          >
            Điều khoản dịch vụ
          </a>
          và
          <a
            href="#"
            className="text-primary-dark ml-1 font-semibold hover:underline"
          >
            Chính sách bảo mật
          </a>
        </span>
        {errors.acceptTerms && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            ⚠️ {errors.acceptTerms}
          </p>
        )}
      </div>
      <Button
        variant={'dark'}
        className="w-full gap-2 rounded-2xl py-3 font-semibold shadow-xl"
      >
        Đăng ký tài khoản
        <CustomIcon name="iconCheckNoCircle" className="text-xs" />
      </Button>
    </div>
  );
}

export default Register;
