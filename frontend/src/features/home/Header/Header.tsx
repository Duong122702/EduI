import { useState } from 'react';
import Button from '../../../components/ui/Button';
import { CustomIcon } from '../../../components/ui/CustomIcon';
import Logo from '../../../components/ui/Logo';

import NavItem from './components/NavItem';
import { Link } from 'react-router-dom';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div
        className={`${isOpen ? 'block' : 'hidden'} fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* <Logo /> */}
          <Logo />

          <div className="hidden gap-8 font-light opacity-70 md:flex">
            <NavItem href="#home">Trang chủ</NavItem>
            <NavItem href="#features">Tính năng</NavItem>
            <NavItem href="#tutorials">Hướng dẫn</NavItem>
          </div>
          <div className="hidden items-center justify-center gap-4 md:flex">
            <NavItem href="/auth">Đăng nhập</NavItem>
            <Link to="/auth">
              <Button
                variant="dark"
                size="medium"
                className="rounded-full shadow-sm"
              >
                {' '}
                Đăng ký
              </Button>
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <Button size={'small'} onClick={handleOpen}>
              {isOpen ? (
                <CustomIcon name="iconClose" className="h-6 w-6" />
              ) : (
                <CustomIcon name="iconBurger" className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        <div
          className={`${isOpen ? 'block' : 'hidden'} absolute top-16 right-0 left-0 border-t border-gray-100 bg-white/95 shadow-xl backdrop-blur-lg md:hidden`}
        >
          <div className="mx-4 flex flex-col gap-4 border-b border-gray-100 py-4">
            <NavItem href="#home" className="border-b border-gray-200 py-2">
              Trang chủ
            </NavItem>
            <NavItem href="#features" className="border-b border-gray-200 py-2">
              Tính năng
            </NavItem>
            <NavItem
              href="#tutorials"
              className="border-b border-gray-200 py-2"
            >
              Hướng dẫn
            </NavItem>
          </div>
          <div className="mx-6 flex flex-col items-start gap-4 pt-2 pb-6">
            {/* <NavItem href="">Đăng nhập</NavItem> */}
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
    </>
  );
}

export default Header;
