export interface QuestionOptionItem {
  key: 'A' | 'B' | 'C' | 'D' | string;
  content?: string;
  image_url?: string;
}

export interface Question {
  id: string;
  sourceLabel?: string;
  content: string;
  questionType: 'Trắc nghiệm' | 'Đúng/Sai' | 'Trả lời ngắn' | string;
  image_url?: string;
  // Sửa thành mảng các Object
  options?: QuestionOptionItem[];
  correct_answer: string;
  explanation?: string;
  score_weight: number;
  created_at: string;
  topic?: string;
  level?: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao' | string;
  subject: string;
}
