import Button from '../ui/Button';
import Logo from '../ui/Logo';
import NavItem from './components/NavItem';

function Header() {
  return (
    <>
      <div className="fixed top-0 z-1000 w-full bg-white">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between border-b border-gray-200 px-4">
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
        {/* Add pointer-events-none */}
        <div className="z-0 border-b border-gray-200 before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:content-['']"></div>
      </div>
    </>
  );
}

export default Header;
