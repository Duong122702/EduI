import { Link } from 'react-router-dom';
import {
  CustomIcon,
  type CustomIconName,
} from '../../components/ui/CustomIcon';

interface NavItemDashProps {
  iconName: CustomIconName;
  title: string;
}

const NavItem: React.FC<NavItemDashProps> = ({ iconName, title }) => {
  return (
    <Link
      to={''}
      className="flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900"
    >
      <CustomIcon name={iconName} className="h-5 w-5" />
      <span>{title}</span>
    </Link>
  );
};

export default NavItem;
