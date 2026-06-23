interface NavItemProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}
const NavItem: React.FC<NavItemProps> = ({ children, href, className }) => {
  return (
    <a
      href={href}
      className={`hover:text-primary cursor-pointer transition-all duration-200 hover:opacity-100 ${className}`}
    >
      {children}
    </a>
  );
};

export default NavItem;
