import Button from '../ui/Button';
import { CustomIcon } from '../ui/CustomIcon';
import { Input } from '../ui/Input';
import HeroCard from './components/HeroCard';
import NavItem from './components/NavItem';

function Header() {
  return (
    <>
      <div className="sticky top-0 z-1000 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* <Logo /> */}
          <div className="flex items-center gap-2">
            <div className="bg-primary-dark radius-4 border-primary-dark flex h-8 w-8 items-center justify-center rounded-md border">
              <CustomIcon
                name="logo"
                className="lucide lucide-book-open h-5 w-5 text-white"
              />
            </div>
            <h1 className="text-xl font-bold">ExamEdu</h1>
          </div>

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
          <div className="align-center mx-auto mb-6 flex h-22 max-w-xl flex-col justify-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl shadow-teal-900/5 transition-all duration-200 md:flex-row">
            <Input
              inputSize="lg"
              placeholder="NHẬP MÃ PHÒNG THI"
              className="flex-3"
            />
            <Button variant="orange" size="large" className="flex-2 font-bold">
              Vào thi ngay
              <CustomIcon
                name="arrowRight"
                className="lucide lucide-arrow-right ml-2 h-5 w-5"
              />
            </Button>
          </div>
          <p className="text-base text-gray-500">
            Bạn là giáo viên?
            <a
              href="#"
              className="text-primary hover:text-primary-dark text-underline-offset-4 mx-2 underline transition-all duration-200"
            >
              Tạo đề thi ngay
            </a>
          </p>
        </div>
      </div>
      <div className="border-y border-gray-100 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 divide-y divide-gray-200/50 sm:grid-cols-1 md:grid-cols-2 md:gap-8 md:divide-x md:divide-y-0 lg:grid-cols-4">
            <HeroCard
              name="badgeDollarSign"
              className="lucide lucide-badge-dollar-sign h-6 w-6"
              title="0đ — Miễn phí"
              dercription="Hoàn toàn miễn phí cho mọi tính năng cốt lõi"
            />
            <div className="flex flex-col items-center px-4 pt-4 text-center md:pt-0">
              <div className="text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-badge-dollar-sign h-6 w-6"
                  data-fg-edye6="1.20:1.1511:/src/app/components/Commitment.tsx:35:17:1205:33:e:item.icon"
                  data-fgid-edye6=":r19:"
                >
                  <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path>
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                  <path d="M12 18V6"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                0đ — Miễn phí
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Hoàn toàn miễn phí cho mọi tính năng cốt lõi
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
