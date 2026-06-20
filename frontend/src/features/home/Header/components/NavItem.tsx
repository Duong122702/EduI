interface NavItemProps {
  children: React.ReactNode;
}
const NavItem: React.FC<NavItemProps> = ({ children }) => {
  return (
    <div className="hover:text-primary cursor-pointer transition-all duration-200 hover:opacity-100">
      {children}
    </div>
  );
};

export default NavItem;
