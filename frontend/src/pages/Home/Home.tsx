import Button from '../../components/ui/Button';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { Input } from '../../components/ui/Input';
import HeroCard from '../../features/home/components/HeroCard';
import Header from '../../features/home/Header';

function Home() {
  return (
    <>
      <Header />
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
              className="h-6 w-6"
              title="0đ — Miễn phí"
              dercription="Hoàn toàn miễn phí cho mọi tính năng cốt lõi"
            />
            <HeroCard
              name="badgeGearSgin"
              className="h-6 w-6"
              title="100% — Tự động"
              dercription="Quy trình trộn đề và chấm điểm hoàn toàn tự động"
            />
            <HeroCard
              name="badgeShield"
              className="h-6 w-6"
              title="Bảo mật — An toàn"
              dercription="Lưu bài tự động mỗi giây, không lo mất dữ liệu"
            />
            <HeroCard
              name="badgeHeadPhone"
              className="h-6 w-6"
              title="Hỗ trợ — 24/7"
              dercription="Hệ thống hỗ trợ thi nhiều môn, file nghe, công thức"
            />
          </div>
        </div>
      </div>
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-4xl">
              Tính năng nổi bật
            </h2>
            <p className="text-lg text-gray-500">
              Tất cả những công cụ bạn cần để tổ chức một kỳ thi trực tuyến công
              bằng, minh bạch và hiệu quả nhất.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-8">
            <div className="group rounded-2xl border border-gray-100 p-8 shadow-sm transition-all duration-300 hover:border-teal-200 hover:shadow-lg">
              <div className="group-hover:bg-primary-dark mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 transition-colors duration-200">
                <CustomIcon
                  name="badgeWarning"
                  className="text-primary h-7 w-7 transition-colors duration-300 group-hover:text-white"
                />
              </div>
              <h3 className="mb-3 text-xl font-bold">Chống gian lận</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Giám sát bằng AI thông minh, tự động khóa màn hình và cảnh báo
                thí sinh khi phát hiện chuyển tab hoặc rời khỏi trang thi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
