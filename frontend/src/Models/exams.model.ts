export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  createdBy: string;
  createdAt: string;
  status: 'Chốt đề' | 'Bản nháp';
  subject: string;
  roomUsed: string[];
}
