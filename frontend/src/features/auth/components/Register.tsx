import { useState } from 'react';
import Button from '../../../components/ui/Button';
import { CustomIcon } from '../../../components/ui/CustomIcon';
import { Input } from '../../../components/ui/Input';
import type { RegisterProps } from '../../../types/AuthTypes/register.type';
import {
  registerSchema,
  type UserFormRegisterValues,
} from '../schemas/register.schema';

import { useRegister } from '../../../hooks/Auth/useRegister';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { handleServerFormErrors } from '../../../utils/handleServerFormErrors';

function Register({ currentTab }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    mutate: registerUser,
    isPending,
    isSuccess,
    data: response,
    isError,
    error,
  } = useRegister();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UserFormRegisterValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      role: 'TEACHER',
      acceptTerms: false,
    },
  });
  const currentRole = watch('role');
  const onSubmit = (data: UserFormRegisterValues) => {
    registerUser(data, {
      onError: (err) => {
        if (err.details) {
          handleServerFormErrors(err, setError);
        }
      },
    });
  };
  if (currentTab !== 'register') return null;
  if (isSuccess && response) {
    const registeredEmail = response.data.data.email;

    return (
      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <div className="mb-3 text-3xl">📩</div>
        <h3 className="text-lg font-bold text-gray-800">
          Xác nhận Email của bạn
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Tài khoản cho{' '}
          <span className="font-semibold text-gray-900">{registeredEmail}</span>{' '}
          đã được tạo thành công!
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Vui lòng kiểm tra hộp thư đến (hoặc thư rác) để kích hoạt tài khoản
          trước khi đăng nhập.
        </p>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 block">
      {isError && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
          ⚠️ {error?.message || 'Đăng ký thất bại. Vui lòng thử lại!'}
        </div>
      )}
      <div className="mb-5">
        <span className="text-xs leading-relaxed font-bold text-gray-500 uppercase">
          Bạn đăng ký với vai trò
        </span>
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`${
              currentRole === 'STUDENT'
                ? 'border-primary'
                : 'border-gray-300 hover:border-gray-400'
            } relative cursor-pointer rounded-xl border-2 p-3 text-center transition-all duration-300`}
            onClick={() =>
              setValue('role', 'STUDENT', { shouldValidate: true })
            }
          >
            <div
              className={`${currentRole === 'STUDENT' ? 'block' : 'hidden'} text-primary-dark absolute top-2 right-2`}
            >
              <CustomIcon name="iconCheck" />
            </div>
            <CustomIcon
              name="logo"
              className={`${currentRole === 'STUDENT' ? 'text-primary-dark' : 'text-gray-400'} mx-auto mb-2 h-6 w-6`}
            />
            <p
              className={`${currentRole === 'STUDENT' ? 'text-gray-800' : 'text-gray-400'} text-center text-xs leading-relaxed font-semibold`}
            >
              Học viên / Thí sinh
            </p>
          </div>
          <div
            className={`${
              currentRole === 'TEACHER'
                ? 'border-primary'
                : 'border-gray-300 hover:border-gray-400'
            } relative cursor-pointer rounded-xl border-2 p-3 text-center transition-all duration-300`}
            onClick={() =>
              setValue('role', 'TEACHER', { shouldValidate: true })
            }
          >
            <div
              className={`${currentRole === 'TEACHER' ? 'block' : 'hidden'} text-primary-dark absolute top-2 right-2`}
            >
              <CustomIcon name="iconCheck" />
            </div>
            <CustomIcon
              name="iconRepresent"
              className={`${currentRole === 'TEACHER' ? 'text-primary-dark' : 'text-gray-300'} mx-auto mb-2 h-6 w-6`}
            />
            <p
              className={`${currentRole === 'TEACHER' ? 'text-gray-800' : 'text-gray-400'} text-center text-xs leading-relaxed font-semibold`}
            >
              Giảng viên / Soạn đề
            </p>
          </div>
        </div>
        {errors.role && (
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
            ⚠️ {errors.role.message}
          </p>
        )}
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
            type="text"
            {...register('fullName')}
            inputSize={'md'}
            className={`bg-white px-10 ${errors.fullName ? 'border-red-500 focus:border-red-500!' : ''}`}
            placeholder="Nguyễn Văn A"
          />
        </div>
        {errors.fullName && (
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
            ⚠️ {errors.fullName.message}
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
            {...register('email')}
            inputSize={'md'}
            className={`bg-white px-10 ${errors.email ? 'border-red-500 focus:border-red-500!' : ''}`}
            placeholder="exemple@example.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
            ⚠️ {errors.email.message}
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
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            inputSize={'md'}
            className={`items-center bg-white px-10 ${errors.password ? 'border-red-500 focus:border-red-500!' : ''}`}
            placeholder="••••••••"
          />
          <div
            className="cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            <CustomIcon
              name="iconEyes"
              className={`hover:text-primary absolute top-1/2 right-4 -translate-y-1/2 ${showPassword ? 'text-primary' : 'text-gray-400'}`}
            />
          </div>
        </div>
        {errors.password && (
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
            ⚠️ {errors.password.message}
          </p>
        )}
      </div>
      <div className="mb-5 flex items-center justify-start gap-2">
        <input
          type="checkbox"
          className="h-4 w-4"
          {...register('acceptTerms')}
        />
        <label htmlFor="acceptTerms" className="text-xs text-gray-800">
          Tôi đồng ý với
          <a
            href="/terms"
            target="_blank"
            className="text-primary-dark mx-1 font-semibold hover:underline"
          >
            Điều khoản dịch vụ
          </a>
          và
          <a
            href="#"
            target="_blank"
            className="text-primary-dark ml-1 font-semibold hover:underline"
          >
            Chính sách bảo mật
          </a>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            ⚠️ {errors.acceptTerms.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        variant={'dark'}
        className="w-full gap-2 rounded-2xl py-3 font-semibold shadow-xl"
        disabled={isPending}
      >
        {isPending ? 'Đang xử lý' : 'Đăng ký tài khoản'}
        <CustomIcon name="iconCheckNoCircle" className="text-xs" />
      </Button>
    </form>
  );
}

export default Register;
