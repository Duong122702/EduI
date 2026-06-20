import { CustomIcon, type CustomIconName } from '../../ui/CustomIcon';

interface HeroCardProps {
  name: CustomIconName;
  className?: string;
  title: string;
  dercription: string;
}

function HeroCard({ name, className, title, dercription }: HeroCardProps) {
  return (
    <div className="flex flex-col items-center px-4 pt-4 text-center md:pt-0">
      <div className="text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
        <CustomIcon name={name} className={className} />
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{dercription}</p>
    </div>
  );
}

export default HeroCard;
