import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import Home from './pages/Home';
import { useAuthStore } from './store/authStore';
import Auth from './pages/Auth/Auth';
import DashBoardLayout from './layouts/DashBoardLayout';

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
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
        index: true,
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
    element: <ProtectedRoute />, // Sử dụng ProtectedRoute làm wrapper
    children: [
      {
        element: <DashBoardLayout />,
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
    ],
  },
]);
