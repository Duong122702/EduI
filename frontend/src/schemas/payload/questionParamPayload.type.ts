export interface QuestionFilterParams {
  subject?: string;
  topic?: string;
  level?: string;
  question_type?: string;
  content?: string;
  source_label?: string;
  score_weight?: number;
}

export interface GetQuestionsParams extends QuestionFilterParams {
  page?: number;
  page_size?: number;
}
