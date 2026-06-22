import type { TutorialCardProps } from '../types/HomeTypes/tutorialCardProps.type';

export const tutorialCardPaths: TutorialCardProps[] = [
  {
    order: '1',
    name: 'badgeUpload',
    title: 'Tải đề lên',
    decription:
      'Tải lên ngân hàng câu hỏi bằng file Word, Excel hoặc tạo trực tiếp trên hệ thống nhanh chóng.',
  },
  {
    order: '2',
    name: 'badgeSetting',
    title: 'Cài đặt cấu hình',
    decription:
      'Thiết lập thời gian, điểm số, tùy chọn đảo đề và các lớp bảo mật chống gian lận.',
  },
  {
    order: '3',
    name: 'badgeShared',
    title: 'Chia sẻ mã phòng thi',
    decription:
      'Gửi mã phòng thi hoặc đường dẫn cho thí sinh để bắt đầu làm bài ngay lập tức.',
  },
];
