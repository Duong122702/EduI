import type { useQuestions } from '@/hooks/Question/useQuestion';
import type { GetQuestionsParams } from '@/schemas/payload/questionParamPayload.type';

export interface QuestionTableProps {
  onClick: () => void;
  data: ReturnType<typeof useQuestions>['data'];
  isPending: boolean;
  params: GetQuestionsParams;
  setParams: React.Dispatch<React.SetStateAction<GetQuestionsParams>>;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}
