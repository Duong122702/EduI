import type { CustomIconName } from '../components/ui/CustomIcon';

export interface FeatureCardProps {
  name: CustomIconName;
  className?: string;
  title: string;
  description: string;
}
