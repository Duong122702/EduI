import { Outlet } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import { useAuthStore } from '../store/authStore';

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
              <span className="block text-lg font-bold tracking-tight text-teal-950">
                EduExam
              </span>
              <span className="text-[10px] font-bold tracking-wider text-teal-600 uppercase">
                {role}
              </span>
            </div>
          </div>
          <nav className="space-y-1.5"></nav>
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
            {/* <LogOut className="w-5 h-5" /> */}
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
