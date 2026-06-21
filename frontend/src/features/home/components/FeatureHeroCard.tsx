import { CustomIcon } from '../../../components/ui/CustomIcon';
import type { FeatureCardProps } from '../../../types/featureCardProps.type';

function FeatureHeroCard({
  name,
  description,
  title,
  className,
}: FeatureCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-100 p-8 shadow-sm transition-all duration-300 hover:border-teal-200 hover:shadow-lg">
      <div className="group-hover:bg-primary-dark mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 transition-colors duration-200">
        <CustomIcon name={name} className={className} />
      </div>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}

export default FeatureHeroCard;
