import { CustomIcon } from '../../../components/ui/CustomIcon';
import Logo from '../../../components/ui/Logo';

function Footer() {
  return (
    <div className="border-t border-gray-900 bg-gray-950 py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-4 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="my-6 max-w-sm text-sm leading-relaxed text-gray-400">
              Nền tảng tổ chức thi và kiểm tra trực tuyến hàng đầu, mang đến
              giải pháp đánh giá năng lực công bằng, minh bạch và hiệu quả nhất.
            </p>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wider text-white">
              SẢN PHẨM
            </h3>
            <ul className="space-y-4 text-sm leading-relaxed text-gray-400">
              <li className="mb-4">
                <a href="#" className="hover:text-primary transition-colors">
                  Tính năng nổi bật
                </a>
              </li>
              <li className="mb-4 leading-relaxed">
                <a href="#" className="hover:text-primary transition-colors">
                  Giải pháp cho Trường học
                </a>
              </li>
              <li className="mb-4 leading-relaxed">
                <a href="#" className="hover:text-primary transition-colors">
                  Giải pháp cho Doanh nghiệp
                </a>
              </li>
              <li className="mb-4 leading-relaxed">
                <a href="#" className="hover:text-primary transition-colors">
                  Bảng giá
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wider text-white uppercase">
              Hỗ Trợ
            </h3>
            <ul className="space-y-4 text-sm leading-relaxed text-gray-400">
              <li className="mb-4">
                <a href="#" className="hover:text-primary transition-colors">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:text-primary transition-colors">
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:text-primary transition-colors">
                  Cộng đồng
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:text-primary transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-semibold tracking-wider text-white uppercase">
              Liên Hệ
            </h3>
            <ul className="leading-relaxed">
              <li className="text-primary mb-4 flex items-start gap-2 text-sm">
                <CustomIcon name="badgePhone" />
                <div>
                  <span className="text-gray-400">Hotline:</span>
                  <a
                    href="#"
                    className="hover:text-primary text-white transition-colors"
                  >
                    1900 1234
                  </a>
                </div>
              </li>
              <li className="text-primary mb-4 flex items-start gap-2 text-sm">
                <CustomIcon name="badgeLetter" />
                <div>
                  <span className="text-gray-400">Email:</span>
                  <a
                    href="#"
                    className="hover:text-primary text-white transition-colors"
                  >
                    duong.cv.hec@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-500 pt-8 text-sm text-gray-400 md:flex-row">
          <p>© 2026 ExamEdu. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="transition-colors hover:text-white">
              Điều khoản dịch vụ
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Chính sách bảo mật
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
