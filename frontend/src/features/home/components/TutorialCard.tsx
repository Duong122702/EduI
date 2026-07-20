import { CustomIcon } from '../../../components/ui/CustomIcon';
import type { TutorialCardProps } from '../../../types/HomeTypes/tutorialCardProps.type';

function TutorialCard({ description, name, order, title }: TutorialCardProps) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="group relative mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-gray-50 bg-white shadow-lg">
        <div className="bg-primary-dark absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
        <div className="bg-primary-dark absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white">
          {order}
        </div>
        <CustomIcon name={name} className="text-primary-dark h-10 w-10" />
      </div>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      <p className="max-w-70 text-sm leading-relaxed text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default TutorialCard;
