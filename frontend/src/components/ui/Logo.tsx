import { CustomIcon } from './CustomIcon';

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary-dark radius-4 border-primary-dark flex h-8 w-8 items-center justify-center rounded-md border">
        <CustomIcon name="logo" className="h-5 w-5 text-white" />
      </div>
      <h1 className="text-xl font-bold">ExamEdu</h1>
    </div>
  );
}

export default Logo;
