import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import type { Question } from '@/Models/questions.model';
import { useState } from 'react';

export const ListQuestionExam = () => {
  const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState<
    Question[] | null
  >(null);
  return (
    <div className="lg:col-spans-8 space-y-4">
      <div className="rounded-2xl border-b border-slate-300 bg-white px-4 py-2 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">
            Danh sách câu hỏi trắc nghiệm:{' '}
            {multipleChoiceQuestions?.length || 0}
          </h3>
          <Button
            variant="default"
            size="lg"
            className="hover:bg-dark text-white"
          >
            Thêm câu hỏi
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Card>
          <CardContent className="flex items-center justify-between rounded-2xl border-b border-slate-300 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                'Nhan đề câu hỏi trắc nghiệm'
              </span>
              <span className="text-muted-foreground text-xs">
                'Chủ đề câu hỏi'
              </span>
              <Badge variant="secondary" className="text-xs">
                <span className="truncate">'Mức độ câu hỏi'</span>
              </Badge>
              <Button
                variant="destructive"
                size="sm"
                className="text-white hover:bg-red-600"
              >
                Xóa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
