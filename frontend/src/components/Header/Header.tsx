import Button from '../ui/Button';
import Logo from '../ui/Logo';
import NavItem from './components/NavItem';

function Header() {
  return (
    <>
      <div className="sticky top-0 z-1000 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Logo />
          <div className="flex gap-8 font-light opacity-70">
            <NavItem>Trang chủ</NavItem>
            <NavItem>Tính năng</NavItem>
            <NavItem>Hướng dẫn</NavItem>
          </div>
          <div className="flex items-center justify-center gap-4">
            <NavItem>Đăng nhập</NavItem>
            <Button variant="dark" size="medium">
              {' '}
              Đăng ký
            </Button>
          </div>
        </div>
      </div>
      <div id="home" className="relative overflow-hidden pt-32 pb-32">
        <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-full w-full max-w-7xl -translate-x-1/2 overflow-hidden">
          <div className="absolute top-[10%] left-[-10%] h-125 w-125 rounded-full bg-teal-50/50 blur-3xl"></div>
          <div className="absolute right-[-5%] bottom-[-10%] h-150 w-150 rounded-full bg-orange-50/30 blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center">
          <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-bold text-gray-900 md:text-6xl">
            Nền tảng Thi trực tuyến
            <br className="hidden md:block" />
            <span className="bg-linear-to-r from-teal-600 to-teal-400 bg-clip-text leading-snug text-transparent">
              Khách quan & Bảo mật
            </span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-gray-500">
            Tổ chức kỳ thi, làm bài kiểm tra và chấm điểm tự động dễ dàng trong
            5 phút. Nhanh chóng, ổn định và hoàn toàn miễn phí.
          </p>
          <div className=""></div>
        </div>
      </div>
    </>
  );
}

export default Header;
