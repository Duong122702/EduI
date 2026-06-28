import { useState } from 'react';
import { CustomIcon } from '../../components/ui/CustomIcon';
import FlexibleTabs from '../../components/ui/FlexibleTabs';
import Logo from '../../components/ui/Logo';

import Login from '../../features/auth/components/Login';
import Register from '../../features/auth/components/Register';

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
            {/* Login */}
            <Login currentTab={currentTab} />
            {/* Register */}
            <Register
              currentTab={currentTab}
              isSelect={isSelect}
              handleRoleChange={handleRoleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
