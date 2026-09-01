import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CirclePlus, Search } from 'lucide-react';
import { useState } from 'react';

export const ExamRoomTable = () => {
  const [activeTab, setActiveTab] = useState('all');
  return (
    <>
      <Card className="rounded-2xl border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative w-1/3 min-w-65">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={''}
                placeholder="Tìm kiếm tên phòng thi"
                className="h-11 truncate rounded-2xl border-slate-200 bg-slate-50/50 pl-11 text-sm placeholder:text-slate-400 focus-visible:ring-emerald-500"
              />
            </div>
            {/* Tabs */}
            <div className="flex">
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full rounded-lg bg-transparent p-2">
                  {['all', 'active', 'inactive'].map((item) => (
                    <TabsTrigger
                      value={item}
                      className="w-1/3 text-xs font-bold data-[state=active]:border data-[state=active]:border-teal-400 data-[state=active]:bg-teal-200/30 data-[state=active]:text-teal-800"
                    >
                      {item === 'all' && 'Tất cả đề thi'}
                      {item === 'active' && 'Đề thi đang hoạt động'}
                      {item === 'inactive' && 'Đề thi không hoạt động'}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <Button
              onClick={() => {}}
              className="h-11 shrink-0 rounded-2xl bg-orange-500 px-5 font-bold text-white shadow-sm transition-all hover:bg-orange-600"
            >
              <CirclePlus className="mr-2 h-5 w-5" />
              Thêm câu hỏi mới
            </Button>
          </div>
        </div>
        {/* Table */}
        <div className="mt-6 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200 hover:bg-transparent">
                <TableHead className="px-4 pb-4 text-center text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Đề thi/Môn học
                </TableHead>
                <TableHead className="px-4 pb-4 text-center text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Thời lượng
                </TableHead>
                <TableHead className="px-4 pb-4 text-center text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Số câu hỏi
                </TableHead>
                <TableHead className="px-4 pb-4 text-center text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Trạng thái
                </TableHead>
                <TableHead className="px-4 pb-4 text-center text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Phòng thi mở từ đề
                </TableHead>
                <TableHead className="px-4 pb-4 text-center text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Tác vụ quản lý
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>
      </Card>
    </>
  );
};
