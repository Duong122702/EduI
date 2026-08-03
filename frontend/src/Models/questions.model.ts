export interface Question {
  id: string;
  exam_id: string;
  question_number: number;
  content: string;
  question_type: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  score_weight: number;
  created_at: string;
  topic?: string;
  level?: string;
}
