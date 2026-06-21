interface NavItemProps {
  children: React.ReactNode;
  href: string;
}
const NavItem: React.FC<NavItemProps> = ({ children, href }) => {
  return (
    <a
      href={href}
      className="hover:text-primary cursor-pointer transition-all duration-200 hover:opacity-100"
    >
      {children}
    </a>
  );
};

export default NavItem;
