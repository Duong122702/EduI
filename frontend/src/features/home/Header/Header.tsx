import Button from '../../../components/ui/Button';
import Logo from '../../../components/ui/Logo';

import NavItem from './components/NavItem';

function Header() {
  return (
    <div className="sticky top-0 z-1000 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* <Logo /> */}
        <Logo />

        <div className="flex gap-8 font-light opacity-70">
          <NavItem href="#home">Trang chủ</NavItem>
          <NavItem href="#features">Tính năng</NavItem>
          <NavItem href="#tutorials">Hướng dẫn</NavItem>
        </div>
        <div className="flex items-center justify-center gap-4">
          <NavItem href="">Đăng nhập</NavItem>
          <Button
            variant="dark"
            size="medium"
            className="rounded-full shadow-sm"
          >
            {' '}
            Đăng ký
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Header;
