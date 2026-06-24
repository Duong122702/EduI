import { CustomIcon } from '../../components/ui/CustomIcon';
import Logo from '../../components/ui/Logo';

function Auth() {
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
      </div>
    </div>
  );
}

export default Auth;
