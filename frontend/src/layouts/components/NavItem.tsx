import { NavLink } from 'react-router-dom';
import {
  CustomIcon,
  type CustomIconName,
} from '../../components/ui/CustomIcon';

interface NavItemDashProps {
  iconName: CustomIconName;
  title: string;
  to: string;
}

const NavItem: React.FC<NavItemDashProps> = ({ iconName, title, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'text-primary bg-teal-50 font-semibold'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`
      }
    >
      <CustomIcon name={iconName} className="h-5 w-5" />
      <span>{title}</span>
    </NavLink>
  );
};

export default NavItem;
