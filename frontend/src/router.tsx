import { createBrowserRouter } from 'react-router-dom';
import App from './App';

export const router = createBrowserRouter([
  {
    path: '/',
    // element: <MainLayout />, // Layout bọc ngoài
    // errorElement: <NotFound />, // Tự động hiển thị trang này nếu URL sai hoặc code lỗi
    children: [
      {
        path: '', // Trùng với đường dẫn cha "/"
        element: <App />,
      },
      {
        path: 'about', // Sẽ là "/about"
        //element: <About />,
      },
    ],
  },
]);
