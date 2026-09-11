import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useQuestions } from '@/hooks/Question/useQuestion';
import type { Question } from '@/Models/questions.model';
import { Check } from 'lucide-react';

interface ListQuestionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedQuestions: Question[] | null;
  setSelectedQuestions: React.Dispatch<React.SetStateAction<Question[] | null>>;
  subject: string; // Thêm prop subject
  questionType: string; // Thêm prop questionType
}

export const ListQuestion = ({
  open,
  onOpenChange,
  selectedQuestions,
  setSelectedQuestions,
  subject,
  questionType,
}: ListQuestionProps) => {
  const { data: QUESTIONS } = useQuestions({
    subject,
    question_type: questionType,
    page: 1,
    page_size: 10,
  });
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Danh sách câu hỏi
          </h2>
        </div>
        <CommandInput placeholder="Gõ câu hỏi để tìm kiếm..." />
        <CommandList>
          <CommandEmpty className="py-6 text-center text-sm text-gray-500">
            Không tìm thấy câu hỏi nào.
          </CommandEmpty>
          <CommandGroup>
            {QUESTIONS?.data.data.questions.map((question, index) => {
              const isSelected =
                selectedQuestions?.some((q) => q.id === question.id) || false;

              return (
                <CommandItem
                  key={index}
                  value={question.content}
                  onSelect={() => {
                    setSelectedQuestions((prev) => {
                      // Nếu prev đang là null, khởi tạo mảng mới chứa câu hỏi này
                      if (!prev) return [question];

                      const isExisting = prev.some((q) => q.id === question.id);

                      if (isExisting) {
                        // Bỏ chọn: Lọc bỏ câu hỏi hiện tại.
                        // (Nếu muốn trả về null khi mảng rỗng thì thêm logic check length)
                        const filtered = prev.filter(
                          (q) => q.id !== question.id
                        );
                        return filtered.length > 0 ? filtered : null;
                      }

                      // Chọn thêm: Nối vào mảng cũ
                      return [...prev, question];
                    });
                  }}
                  className={`flex cursor-pointer items-center justify-between transition-all duration-200 ${
                    isSelected
                      ? 'bg-gray-50/50 text-gray-400 opacity-50' // Làm mờ câu hỏi đã chọn
                      : 'text-gray-900'
                  }`}
                >
                  {question.image_url && (
                    <img
                      src={question.image_url}
                      alt="Question"
                      className="mr-2 h-8 w-8 rounded object-cover"
                    />
                  )}
                  <span>{question.content}</span>

                  {isSelected && <Check className="h-4 w-4 text-gray-400" />}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};
