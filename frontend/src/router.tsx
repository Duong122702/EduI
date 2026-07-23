import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import Home from './pages/Home';
import { useAuthStore } from './store/authStore';
import Auth from './pages/Auth/Auth';

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return;
};
const PublicOnlyRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    // Đã đăng nhập rồi mà cố vào /auth -> Đẩy sang /dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // Layout bọc ngoài
    // errorElement: <NotFound />, // Tự động hiển thị trang này nếu URL sai hoặc code lỗi
    children: [
      {
        path: '', // Trùng với đường dẫn cha "/"
        element: <Home />,
      },
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: 'auth',
            element: <Auth />,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />, // Sử dụng ProtectedRoute làm wrapper
    children: [
      {
        path: 'dashboard',
        //element: <Dashboard />,
      },
      {
        path: 'profile',
        //element: <Profile />,
      },
    ],
  },
]);
