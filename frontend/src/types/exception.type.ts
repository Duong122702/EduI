export interface CustomApiError {
  status_code: number;
  code: string;
  message: string;
  details?: Record<string, string[] | string> | any;
}
