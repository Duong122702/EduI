import { useState } from 'react';
import { CustomIcon } from '../../components/ui/CustomIcon';
import FlexibleTabs from '../../components/ui/FlexibleTabs';
import Logo from '../../components/ui/Logo';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';

function Auth() {
  const [currentTab, setCurrentTab] = useState<string | number>('login');
  const [isSelect, setIsSelect] = useState<boolean>(true);

  const handleTabChange = (id: string | number) => {
    setCurrentTab(id);
  };
  const handleRoleChange = () => {
    setIsSelect(!isSelect);
  };
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="m-0 grid min-h-175 w-full max-w-6xl grid-cols-1 overflow-hidden bg-white shadow-xl md:m-6 md:grid-cols-12 md:rounded-3xl">
        <div className="hidden flex-col justify-between overflow-hidden bg-linear-to-tr from-teal-950 via-teal-900 to-teal-700 p-12 text-white md:col-span-5 md:flex">
          <div className="flex items-center space-x-3">
            <Logo />
          </div>
          <div className="mb-12 space-y-6">
            <span className="inline-block rounded-full border border-teal-300 bg-teal-500 px-3 py-1.5 text-xs font-semibold tracking-wider text-white uppercase">
              Nền tảng bảo mật hàng đầu
            </span>
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight uppercase lg:text-4xl">
              "From Assessment to Excellence"
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-gray-400">
              Trải nghiệm phòng thi trực tuyến không áp lực với cơ chế tự động
              hóa thông minh, chống gian lận và tối ưu trải nghiệm thí sinh.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-teal-400">
            <CustomIcon name="badgeShield" />
            <p>Mã hóa đầu cuối hệ thống và giám sát trực tiếp</p>
          </div>
        </div>
        <div className="col-span-1 flex flex-col items-center justify-center p-8 md:col-span-7 md:p-16">
          <div className="mx-auto w-full max-w-md">
            <div>
              <h2 className="mb-3 text-2xl font-bold tracking-tight">
                Chào mừng ban trở lại
              </h2>
              <p className="text-md text-gray-400">
                Vui lòng nhập thông tin để truy cập phòng thi.
              </p>
            </div>
            <FlexibleTabs
              tabs={[
                { id: 'login', label: 'Đăng nhập' },
                { id: 'regis', label: 'Đăng ký mới' },
              ]}
              variant={'grayBox'}
              activeTabId={currentTab}
              onChange={handleTabChange}
              size="medium"
              className="mt-8"
            />
            <div
              className={`${currentTab === 'login' ? 'block' : 'hidden'} mt-8`}
            >
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
                    inputSize={'md'}
                    className="bg-white px-10"
                    placeholder="student@example.com"
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
                <input type="checkbox" className="h-4 w-4" />
                <span className="text-xs text-gray-800">
                  Duy trì đăng nhập trong 30 ngày
                </span>
              </div>
              <Button
                variant={'dark'}
                className="w-full gap-2 rounded-2xl py-3 font-semibold shadow-xl"
              >
                Đăng nhập ngay
                <CustomIcon name="arrowRight" />
              </Button>
            </div>
            <div
              className={`${currentTab === 'regis' ? 'block' : 'hidden'} mt-8`}
            >
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
                    className="bg-white px-10"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
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
                    className="bg-white px-10"
                    placeholder="exemple@example.com"
                  />
                </div>
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
              </div>
              <Button
                variant={'dark'}
                className="w-full gap-2 rounded-2xl py-3 font-semibold shadow-xl"
              >
                Đăng ký tài khoản
                <CustomIcon name="iconCheckNoCircle" className="text-xs" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
