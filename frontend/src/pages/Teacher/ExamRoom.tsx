import { Card, CardContent } from '@/components/ui/card';
import { CirclePlay, FileStack } from 'lucide-react';

export const ExamRoom = () => {
  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Quản lý Đề thi & Phòng thi
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Soạn thảo đề thi trực quan, cấu hình bảo mật phòng thi và quản lý
            luồng làm bài của học viên.
          </p>
        </div>
        {/* Status indicator */}
        <div className="flex items-center space-x-2 self-start rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 sm:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>
            Trạng thái hệ thống:{' '}
            <strong className="font-semibold">Hoạt động ổn định</strong>
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Card số lượng đề thi */}
        <Card className="rounded-2xl border-slate-100 bg-white shadow-sm">
          <CardContent className="flex items-start justify-between p-6">
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                TỔNG ĐỀ THI ĐÃ TẠO
              </p>
              <h2 className="text-3xl font-bold text-slate-900">Số đề ở đây</h2>
              <p className="text-xs text-slate-500">
                Nạp nhiều nhất:{' '}
                <span className="font-semibold text-slate-700">
                  Số đề ở đây
                </span>
              </p>
            </div>
            <div className="rounded-xl bg-teal-50 p-3 text-teal-600">
              <FileStack className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card số lượng phòng thi đang hoạt động */}
        <Card className="rounded-2xl border-slate-100 bg-white shadow-sm">
          <CardContent className="flex items-start justify-between p-6">
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                PHÒNG THI ĐANG HOẠT ĐỘNG
              </p>
              <h2 className="text-3xl font-bold text-teal-500">
                Số phòng ở đây
              </h2>
              <p className="text-xs text-slate-500">
                Thí sinh đang trực tuyến:{' '}
                <span className="font-semibold text-slate-700">
                  Số thí sinh ở đây
                </span>
              </p>
            </div>
            <div className="rounded-xl bg-teal-50 p-3 text-teal-600">
              <CirclePlay className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        {/* Card số lượt nộp bài */}
        <Card className="rounded-2xl border-slate-100 bg-white shadow-sm">
          <CardContent className="flex items-start justify-between p-6">
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                LƯỢT NỘP BÀI
              </p>
              <h2 className="text-3xl font-bold text-slate-500">
                Số lượt ở đây
              </h2>
              <p className="text-xs text-slate-500">
                Trong 24 giờ qua:{' '}
                <span className="font-semibold text-slate-500">
                  Số lượt ở đây
                </span>
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-teal-500">
              <FileStack className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
