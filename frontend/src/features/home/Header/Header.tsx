import Button from '../../../components/ui/Button';
import { CustomIcon } from '../../../components/ui/CustomIcon';

import NavItem from './components/NavItem';

function Header() {
  return (
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
          <NavItem href="#home">Trang chủ</NavItem>
          <NavItem href="#features">Tính năng</NavItem>
          <NavItem href="tutorials">Hướng dẫn</NavItem>
        </div>
        <div className="flex items-center justify-center gap-4">
          <NavItem href="">Đăng nhập</NavItem>
          <Button variant="dark" size="medium">
            {' '}
            Đăng ký
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Header;
