export const SUBJECT_LIST = [
  'Toán học',
  'Vật lý',
  'Hóa học',
  'Sinh học',
  'Lịch sử',
  'Địa lý',
  'Tiếng anh',
] as const;

export type SubjectName = (typeof SUBJECT_LIST)[number];
