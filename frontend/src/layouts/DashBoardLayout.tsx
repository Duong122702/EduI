import { Outlet } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import { useAuthStore } from '../store/authStore';
import { CustomIcon } from '../components/ui/CustomIcon';
import NavItem from './components/NavItem';

export const DashBoardLayout = () => {
  const currentUser = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex w-full shrink-0 flex-col justify-center border-b border-slate-200 bg-white p-6 md:w-64 md:border-r md:border-b-0">
        <div>
          <div className="mb-8 flex items-center space-x-3">
            <Logo />
            <div>
              <span className="text-[10px] font-bold tracking-wider text-teal-600 uppercase">
                {role}
              </span>
            </div>
          </div>
          {role === 'TEACHER' ? (
            <nav className="space-y-1.5">
              <NavItem
                iconName="iconDashboard"
                title="Bảng điều khiển"
                to="/dashboard"
              />
              <NavItem
                iconName="iconDocument"
                title="Quản lý đề thi & phòng"
                to="/dashboard/exams"
              />
              <NavItem
                iconName="iconDatabase"
                title="Ngân hàng câu hỏi"
                to="/dashboard/questions"
              />
              <NavItem
                iconName="iconGroup"
                title="Danh sách thí sinh"
                to="/dashboard/students"
              />
              <NavItem
                iconName="iconUp"
                title="Kết quả & phổ điểm"
                to="/dashboard/results"
              />
            </nav>
          ) : (
            /* Hiển thị cho các role khác (VD: STUDENT hoặc ADMIN) */
            <nav className="space-y-1.5">
              <NavItem
                iconName="iconDashboard"
                title="Bảng điều khiển"
                to="/dashboard"
              />
              <NavItem
                iconName="iconCalender"
                title="Lịch thi lớp học"
                to="/dashboard/schedule"
              />
              <NavItem
                iconName="iconWeight"
                title="Ngân hàng & ôn luyện"
                to="/dashboard/practice"
              />
              <NavItem
                iconName="iconClock"
                title="Lịch sử & Phổ điểm"
                to="/dashboard/history"
              />
            </nav>
          )}
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <div className="flex items-center space-x-3">
            <img
              src=""
              alt={currentUser?.name}
              className="h-10 w-10 rounded-full border border-teal-200 object-cover"
            />
            <div>
              <p className="text-xs font-bold text-slate-900">
                {currentUser?.name}
              </p>
              <p className="text-[10px] text-slate-400">
                ID: {currentUser?.id}
              </p>
            </div>
          </div>
          <button
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-red-500"
            title="Đăng xuất"
            onClick={logout}
          >
            <CustomIcon name="iconLogout" className="h-6 w-6" />
          </button>
        </div>
      </aside>
      <main className="relative mx-auto w-full max-w-7xl flex-1 space-y-8 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default DashBoardLayout;
