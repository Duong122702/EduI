import { useState } from 'react';
import Button from '../../../components/ui/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import { CustomIcon } from '../../../components/ui/CustomIcon';
import { Input } from '../../../components/ui/Input';
import type { LoginProps } from '../../../types/AuthTypes/login.type';
import { loginSchema, type UserFormLoginValues } from '../schemas/login.schema';
import { useLogin } from '../../../hooks/Auth/useLogin';
import { useForm } from 'react-hook-form';
import { handleServerFormErrors } from '../../../utils/handleServerFormErrors';

function Login({ currentTab }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error, isError } = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserFormLoginValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      acceptTerms: false, //rememberME
    },
  });
  const onSubmit = (data: UserFormLoginValues) => {
    login(data, {
      onError: (error) => {
        if (error.details) {
          handleServerFormErrors(error, setError);
        }
      },
    });
  };

  if (currentTab !== 'login') return null;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
      {isError && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
          {error.message}
        </div>
      )}
      <div className="mb-5">
        <span className="text-xs leading-relaxed font-bold text-gray-500 uppercase">
          Email học tập
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
            placeholder="student@example.com"
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
            Mật khẩu
          </span>
          <a
            href=""
            className="text-xs font-semibold text-amber-500 hover:text-amber-600"
          >
            Quên mật khẩu?
          </a>
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
        <span className="text-xs text-gray-800">
          Duy trì đăng nhập trong 30 ngày
        </span>
      </div>
      <Button
        variant={'dark'}
        className="w-full gap-2 rounded-2xl py-3 font-semibold shadow-xl"
        disabled={isPending}
      >
        {isPending ? 'Đang xử lý' : 'Đăng nhập ngay'}
        <CustomIcon name="arrowRight" />
      </Button>
    </form>
  );
}

export default Login;
