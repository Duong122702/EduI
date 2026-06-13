import Button from '../ui/Button';
import NavItem from './components/NavItem';

function Header() {
  return (
    <>
      <div className="fixed top-0 z-1000 w-full bg-white">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between border-b border-gray-200 px-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary-dark radius-4 border-primary-dark flex h-8 w-8 items-center justify-center rounded-md border">
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
                className="lucide lucide-book-open h-5 w-5 text-white"
                data-fg-d5jy4="1.14:1.1547:/src/app/components/Header.tsx:10:13:466:43:e:BookOpen::::::BP4H"
                data-fgid-d5jy4=":r6:"
              >
                <path d="M12 7v14"></path>
                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
              </svg>
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
        {/* Add pointer-events-none */}
        <div className="z-0 border-b border-gray-200 before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:content-['']"></div>
      </div>
    </>
  );
}

export default Header;
