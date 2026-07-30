import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import { CustomIcon } from '../../../components/ui/CustomIcon';
import { Input } from '../../../components/ui/Input';
import type { LoginProps } from '../../../types/AuthTypes/login.type';
import { loginSchema, type UserFormLoginValues } from '../schemas/login.schema';
import { useLogin } from '../../../hooks/Auth/useLogin';
import { useForm } from 'react-hook-form';
import { handleServerFormErrors } from '../../../utils/handleServerFormErrors';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

function Login({ currentTab }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error, isError } = useLogin();

  const form = useForm<UserFormLoginValues>({
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
          handleServerFormErrors(error, form.setError);
        }
      },
    });
  };

  if (currentTab !== 'login') return null;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
        {isError && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
            {error.message}
          </div>
        )}
        {/* Email field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs leading-relaxed font-bold text-gray-500 uppercase">
                Email hệ thống
              </FormLabel>
              <FormControl>
                <div className="relative mt-2">
                  <CustomIcon
                    name="badgeLetter"
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    type="email"
                    {...field}
                    className="h-11 rounded-xl bg-white px-10"
                    placeholder="student@example.com"
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
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs leading-relaxed font-bold text-gray-500 uppercase">
                  Mật khẩu
                </FormLabel>
                <a
                  href="#"
                  className="text-xs font-semibold text-amber-500 hover:text-amber-600"
                >
                  Quên mật khẩu
                </a>
              </div>
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
                  <div
                    className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <CustomIcon
                      name="iconEyes"
                      className={`hover:text-primary ${
                        showPassword ? 'text-primary' : 'text-gray-400'
                      }`}
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* term field */}
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
              <FormLabel className="cursor-pointer text-xs font-normal text-gray-800">
                Duy trì đăng nhập trong 30 ngày
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant={'dark'}
          className="w-full gap-2 rounded-2xl py-3 font-semibold shadow-xl"
          disabled={isPending}
        >
          {isPending ? 'Đang xử lý' : 'Đăng nhập ngay'}
          <CustomIcon name="arrowRight" />
        </Button>
      </form>
    </Form>
  );
}

export default Login;
