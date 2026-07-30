import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

function Register({ currentTab }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    mutate: registerApi,
    isPending,
    isSuccess,
    data: response,
    isError,
    error,
  } = useRegister();
  const form = useForm<UserFormRegisterValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      role: 'TEACHER',
      acceptTerms: false,
    },
  });
  //const currentRole = form.watch('role');
  const onSubmit = (data: UserFormRegisterValues) => {
    registerApi(data, {
      onError: (err) => {
        if (err.details) {
          handleServerFormErrors(err, form.setError);
        }
      },
    });
  };
  if (currentTab !== 'regis') return null;
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
        {isError && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
            ⚠️ {error?.message || 'Đăng ký thất bại. Vui lòng thử lại!'}
          </div>
        )}
        {/* Role field */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="leading text-xs leading-relaxed font-bold text-gray-500 uppercase">
                Bạn đăng ký với vai trò
              </FormLabel>
              <FormControl>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div
                    className={`${field.value === 'STUDENT' ? 'border-primary' : 'border-gray-300 hover:border-gray-400'} relative cursor-pointer rounded-xl border-2 p-3 text-center transition-all duration-300`}
                    onClick={() => field.onChange('STUDENT')}
                  >
                    <div
                      className={`${field.value === 'STUDENT' ? 'block' : 'hidden'} text-primary-dark absolute top-2 right-2`}
                    >
                      <CustomIcon name="iconCheck" />
                    </div>
                    <CustomIcon
                      name="logo"
                      className={`${field.value === 'STUDENT' ? 'text-primary-dark' : 'text-gray-400'} mx-auto mb-2 h-6 w-6`}
                    />
                    <p
                      className={`${field.value === 'STUDENT' ? 'text-gray-800' : 'text-gray-400'} text-center text-xs leading-relaxed font-semibold`}
                    >
                      Học viên / Thí sinh
                    </p>
                  </div>
                  <div
                    className={`${
                      field.value === 'TEACHER'
                        ? 'border-primary'
                        : 'border-gray-300 hover:border-gray-400'
                    } relative cursor-pointer rounded-xl border-2 p-3 text-center transition-all duration-300`}
                    onClick={() => field.onChange('TEACHER')}
                  >
                    <div
                      className={`${
                        field.value === 'TEACHER' ? 'block' : 'hidden'
                      } text-primary-dark absolute top-2 right-2`}
                    >
                      <CustomIcon name="iconCheck" />
                    </div>
                    <CustomIcon
                      name="iconRepresent"
                      className={`${
                        field.value === 'TEACHER'
                          ? 'text-primary-dark'
                          : 'text-gray-300'
                      } mx-auto mb-2 h-6 w-6`}
                    />
                    <p
                      className={`${
                        field.value === 'TEACHER'
                          ? 'text-gray-800'
                          : 'text-gray-400'
                      } text-center text-xs leading-relaxed font-semibold`}
                    >
                      Giảng viên / Soạn đề
                    </p>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        {/* fullname field */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs leading-relaxed font-bold text-gray-500 uppercase">
                Họ và tên
              </FormLabel>
              <FormControl className="relative mt-2">
                <CustomIcon
                  name="iconAvatar"
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                />
                <Input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="h-11 rounded-xl bg-white px-10"
                  {...field}
                />
              </FormControl>
              <FormControl />
            </FormItem>
          )}
        />
        {/* email field  */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs leading-relaxed font-bold text-gray-500 uppercase">
                Địa chỉ email
              </FormLabel>
              <FormControl>
                <div className="relative mt-2">
                  <CustomIcon
                    name="badgeLetter"
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    type="email"
                    placeholder="example@example.com"
                    className="h-11 rounded-xl bg-white px-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* password field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs leading-relaxed font-bold text-gray-500 uppercase">
                Thiết lập mật khẩu
              </FormLabel>
              <FormControl>
                <div className="relative mt-2">
                  <CustomIcon
                    name="iconLock"
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="h-11 items-center rounded-xl bg-white px-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="mt-2 flex flex-row items-start space-y-0 space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 cursor-pointer"
                  checked={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="cursor-pointer text-xs font-normal text-gray-800">
                  Tôi đồng ý
                  <a
                    href="/terms"
                    target="_blank"
                    className="text-primary-dark mx-1 font-semibold hover:underline"
                  >
                    Điều khoản dịch vụ
                  </a>
                  và
                  <a
                    href="/privacy"
                    target="_blank"
                    className="text-primary-dark mx-1 font-semibold hover:underline"
                  >
                    Chính sách bảo mật
                  </a>
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
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
    </Form>
  );
}

export default Register;
