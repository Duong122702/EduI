function Header() {
  return (
    <>
      <div>
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
          <div className="flex gap-8">
            <div>Trang chủ</div>
            <div>Tính năng</div>
            <div>Hướng dẫn</div>
          </div>
          <div className="flex gap-4">
            <button>Đăng ký</button>
            <button>Đăng nhập</button>
          </div>
        </div>
        <div className="border-b border-gray-200 before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:content-['']"></div>
      </div>
    </>
  );
}

export default Header;
