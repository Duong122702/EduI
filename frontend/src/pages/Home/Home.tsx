import { useState } from 'react';
import Button from '../../components/ui/Button';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { Input } from '../../components/ui/Input';
import { featureHeroData } from '../../constants/featureHeroPaths';
import { heroCardPaths } from '../../constants/heroCardPaths';
import FeatureHeroCard from '../../features/home/components/FeatureHeroCard';
import HeroCard from '../../features/home/components/HeroCard';
import Header from '../../features/home/Header';
import { tutorialCardPaths } from '../../constants/tutorialCardPaths';
import TutorialCard from '../../features/home/components/TutorialCard';
import Footer from '../../features/home/Footer/Footer';

function Home() {
  const [isActive, setIsActive] = useState<boolean>();
  const classBtn =
    'flex-1 cursor-pointer rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200';
  const startIdx = !isActive ? 0 : 3;
  const endIdx = !isActive ? 3 : 6;
  const handleSetAcitve = () => {
    setIsActive(!isActive);
  };
  return (
    <>
      <Header />
      <div id="home" className="relative overflow-hidden pt-32 pb-32">
        {/* <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-full w-full max-w-7xl -translate-x-1/2 overflow-hidden">
          <div className="absolute top-[10%] left-[-10%] h-125 w-125 rounded-full bg-teal-50/50 blur-3xl"></div>
          <div className="absolute right-[-5%] bottom-[-10%] h-150 w-150 rounded-full bg-orange-50/30 blur-3xl"></div>
        </div> */}
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
            <Button
              variant="orange"
              size="large"
              className="flex-2 rounded-xl font-bold shadow-sm"
            >
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
            {heroCardPaths.map((path) => (
              <HeroCard key={path.name} {...path} />
            ))}
          </div>
        </div>
      </div>
      <div id="features" className="py-24">
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featureHeroData.map((data) => (
              <FeatureHeroCard key={data.name} {...data} />
            ))}
          </div>
        </div>
      </div>
      <div id="tutorials" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-3xl">
              Cách thức hoạt động
            </h2>
            <p className="text-lg text-gray-500">
              Dù bạn là người ra đề hay người làm bài, mọi thao tác đều được tối
              giản hóa chỉ trong 3 bước.
            </p>
          </div>
          <div className="mx-auto mb-12 flex max-w-md rounded-full border border-gray-200 p-1.5 shadow-sm">
            <button
              onClick={handleSetAcitve}
              className={`${classBtn} ${!isActive ? `bg-primary-dark text-white shadow-md` : `text-gray-500 hover:bg-gray-50 hover:text-gray-900`}`}
            >
              Dành cho Giáo viên
            </button>
            <button
              onClick={handleSetAcitve}
              className={`${classBtn} ${isActive ? `bg-primary-dark text-white shadow-md` : `text-gray-500 hover:bg-gray-50 hover:text-gray-900`}`}
            >
              Dành cho Thí sinh
            </button>
          </div>
          <div className="mx-auto max-w-5xl">
            <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="absolute top-11 right-[15%] left-[15%] hidden h-0.5 bg-gray-200 md:block"></div>
              {tutorialCardPaths.slice(startIdx, endIdx).map((path) => (
                <TutorialCard
                  key={path.name}
                  order={path.order}
                  name={path.name}
                  title={path.title}
                  decription={path.decription}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-teal-900 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mx-auto mb-6 max-w-3xl text-3xl leading-tight font-bold tracking-tight text-white md:text-5xl">
            Sẵn sàng tổ chức kỳ thi chuyên nghiệp đầu tiên của bạn?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-teal-100">
            Miễn phí hoàn toàn. Không cần cài đặt. Bắt đầu ngay trong chưa đầy 5
            phút.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <Button
              variant={'orange'}
              size="extralarge"
              className="gap-2 rounded-full font-bold"
            >
              Trải nghiệm miễn phí ngay
              <CustomIcon name="arrowRight" />
            </Button>
            <Button
              variant={'dark'}
              size="extralarge"
              className="rounded-full font-bold"
            >
              Tạo đề thi ngay
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
