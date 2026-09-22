import { Form } from '@/components/ui/form';

import { levelColorMap } from '@/constants/levelColor';
import type { QuestionFormAddValue } from '@/features/questionbank/Schemas/AddFormSchema';
import { useQuestionOptions } from '@/hooks/Question/useQuestionOptions';
import type { Question } from '@/Models/questions.model';
import { useRef, useState, type ChangeEvent } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { SubjectFormField } from './FormDataAdd/SubjectFormField';
import { TopicFormField } from './FormDataAdd/TopicFormField';
import { LevelFormField } from './FormDataAdd/LevelFormField';
import { TypeFormField } from './FormDataAdd/TypeFormField';
import { ExplanationFormField } from './FormDataAdd/ExplanationFormField';
import { SourceFormField } from './FormDataAdd/SourceFormField';
import { ContentFormField } from './FormDataAdd/ContentFormField';
import { ScoreFormField } from './FormDataAdd/ScoreFormField';
import { IsPassageField } from './FormDataAdd/IsPassageField';
import { SubQuestionField } from './FormDataAdd/SubQuestionField';
import { ListQuestion } from '@/features/examroom/components/ListQuestion';

interface FormDataAddProps {
  form: UseFormReturn<QuestionFormAddValue>;
  onSubmit: (data: QuestionFormAddValue) => void;
  options?: QuestionFormAddValue['options'];
  questions?: Question[];
}

export type OptionKey = 'A' | 'B' | 'C' | 'D';

export const FormDataAdd = ({
  form,
  onSubmit,
  questions,
}: FormDataAddProps) => {
  const { uniqueSubjects } = useQuestionOptions(questions);
  const [openListQuestion, setOpenListQuestion] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[] | null>(
    null
  );
  // Thêm 1 ref cho ảnh đề bài trong FormDataAdd:
  const questionImageRef = useRef<HTMLInputElement>(null);

  const questionImageFile = form.watch('question_image_file') as
    | File
    | null
    | undefined;
  const questionImagePreview =
    questionImageFile instanceof File
      ? URL.createObjectURL(questionImageFile)
      : null;

  const handleFileContentChange = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    form.setValue('question_image_file', file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleDelete = () => {
    form.setValue('question_image_file', null, {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (questionImageRef.current) {
      questionImageRef.current.value = '';
    }
  };

  const onError = (errors: any) => {
    console.log('Form Validation Errors: ', errors);
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-5 py-4"
          id="add-question-form"
        >
          {/* CÂU HỎI CHÙM (PASSAGE) */}
          <IsPassageField control={form.control} name="isPassage" />
          {/* BỘ MÔN */}
          <SubjectFormField
            control={form.control}
            name="subject"
            uniqueSubjects={uniqueSubjects}
          />

          {/* CHỦ ĐỀ */}
          <TopicFormField control={form.control} name="topic" />

          {/* ĐỘ KHÓ */}
          <LevelFormField
            control={form.control}
            name="level"
            levelColorMap={levelColorMap}
          />

          {/* THỂ LOẠI CÂU HỎI VÀ ĐÁP ÁN */}
          <TypeFormField form={form} />

          {/* NỘI DUNG ĐỀ BÀI */}
          <ContentFormField
            control={form.control}
            name="content"
            handleDelete={handleDelete}
            handleFileContentChange={handleFileContentChange}
            questionImageFile={questionImageFile}
            questionImagePreview={questionImagePreview}
            questionImageRef={questionImageRef}
          />
          {/* HƯỚNG DẪN GIẢI */}
          <ExplanationFormField control={form.control} name="explanation" />

          {/* SỐ THỨ TỰ & ĐIỂM SỐ */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SourceFormField control={form.control} name="sourceLabel" />

            <ScoreFormField control={form.control} name="scoreWeight" />
          </div>
          <SubQuestionField
            control={form.control}
            name="parent_ids"
            questions={selectedQuestions || []}
            onAddQuestion={() => {
              setOpenListQuestion(true);
            }}
          />
        </form>
      </Form>
      <ListQuestion
        open={openListQuestion}
        onOpenChange={() => {
          setOpenListQuestion(!openListQuestion);
        }}
        subject={form.getValues('subject')}
        questionType={form.getValues('questionType')}
        selectedQuestions={selectedQuestions}
        setSelectedQuestions={setSelectedQuestions}
      />
    </>
  );
};

export default FormDataAdd;
