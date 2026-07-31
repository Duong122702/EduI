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
        path: 'dashboard',
        element: <DashBoardLayout />,
        children: [
          {
            index: true,
            //element: <DashboardHome />,
          },
          // các Route dành cho Giảng viên (TEACHER)
          {
            path: 'exams', // Khớp với NavItem to="/dashboard/exams"
            //element: <ExamManagement />,
          },
          {
            path: 'questions', // Khớp với NavItem to="/dashboard/questions"
            //element: <QuestionBank />,
          },
          {
            path: 'students', // Khớp với NavItem to="/dashboard/students"
            //element: <StudentList />,
          },
          {
            path: 'results', // Khớp với NavItem to="/dashboard/results"
            //element: <ResultsOverview />,
          },

          // Các Route dành cho Học viên (STUDENT)
          {
            path: 'schedule', // Khớp với NavItem to="/dashboard/schedule"
            //element: <ClassSchedule />,
          },
          {
            path: 'practice', // Khớp với NavItem to="/dashboard/practice"
            //element: <PracticeBank />,
          },
          {
            path: 'history', // Khớp với NavItem to="/dashboard/history"
            //element: <ExamHistory />,
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
