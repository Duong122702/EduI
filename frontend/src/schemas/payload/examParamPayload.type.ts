interface ExamFilterParams {
  status?: string;
  title?: string;
}

export interface ExamParamPayload extends ExamFilterParams {
  page?: number;
  page_size?: number;
}
