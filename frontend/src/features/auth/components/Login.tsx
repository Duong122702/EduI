import { useState } from 'react';
import Button from '../../../components/ui/Button';
import { CustomIcon } from '../../../components/ui/CustomIcon';
import { Input } from '../../../components/ui/Input';
import type { LoginProps } from '../../../types/AuthTypes/login.type';
import type { UserFormLoginValues } from '../schemas/login.schema';

function Login({ currentTab }: LoginProps) {
  const [loginFormData, setLoginFormData] = useState<UserFormLoginValues>({
    email: '',
    password: '',
    acceptTerms: false,
  });
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // 2. Chỉ gửi dữ liệu lên component cha khi user click Submit
  };
  return (
    <div className={`${currentTab === 'login' ? 'block' : 'hidden'} mt-8`}>
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
            name="email"
            type="email"
            value={loginFormData.email}
            inputSize={'md'}
            className="bg-white px-10"
            placeholder="student@example.com"
            onChange={handleInputChange}
          />
        </div>
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
            type="password"
            name="password"
            value={loginFormData.password}
            onChange={handleInputChange}
            inputSize={'md'}
            className="items-center bg-white px-10"
            placeholder="••••••••"
          />
          <div className="cursor-pointer">
            <CustomIcon
              name="iconEyes"
              className="hover:text-primary absolute top-1/2 right-4 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>
      <div className="mb-5 flex items-center justify-start gap-2">
        <input
          type="checkbox"
          className="h-4 w-4"
          name="acceptTerms"
          checked={loginFormData.acceptTerms}
          onChange={handleInputChange}
        />
        <span className="text-xs text-gray-800">
          Duy trì đăng nhập trong 30 ngày
        </span>
      </div>
      <Button
        variant={'dark'}
        className="w-full gap-2 rounded-2xl py-3 font-semibold shadow-xl"
        onClick={handleSubmit}
      >
        Đăng nhập ngay
        <CustomIcon name="arrowRight" />
      </Button>
    </div>
  );
}

export default Login;
