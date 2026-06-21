import type { FeatureCardProps } from '../types/featureCardProps.type';

const classNameConst =
  'text-primary h-7 w-7 transition-colors duration-300 group-hover:text-white';

export const featureHeroData: FeatureCardProps[] = [
  {
    name: 'badgeWarning',
    className: classNameConst,
    title: 'Chống gian lận',
    description:
      'Giám sát bằng AI thông minh, tự động khóa màn hình và cảnh báo thí sinh khi phát hiện chuyển tab hoặc rời khỏi trang thi.',
  },
  {
    name: 'badgeShuffle',
    className: classNameConst,
    title: 'Đảo đề thông minh',
    description:
      'Tự động trộn thứ tự câu hỏi và đáp án từ ngân hàng đề, tạo ra các mã đề khác nhau giúp hạn chế tối đa việc sao chép.',
  },
  {
    name: 'badgeLightning',
    className: classNameConst,
    title: 'Chấm điểm thần tốc',
    description:
      'Hệ thống tự động chấm điểm và trả kết quả ngay lập tức sau khi nộp bài, đi kèm với biểu đồ phân tích lỗi sai chi tiết.',
  },
  {
    name: 'badgeDocument',
    className: classNameConst,
    title: 'Lưu bài tự động',
    description:
      'Bảo vệ bài làm tuyệt đối. Hệ thống lưu lại từng câu trả lời mỗi giây, đảm bảo không mất dữ liệu ngay cả khi rớt mạng.',
  },
];
