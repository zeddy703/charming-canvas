import { 
  LayoutDashboard, 
  User, 
  History, 
  CreditCard, 
  PlusCircle, 
  Ticket, 
  Users, 
  Award, 
  Compass, 
  Settings,
  X,
  ChevronDown,
  Video
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'My Dashboard', path: '/' },
  { icon: User, label: 'My Profile', path: '/profile' },
  { icon: History, label: 'My Degree History', path: '/degree-history' },
  { icon: CreditCard, label: 'My Payments', path: '/payments' },
  { icon: Video, label: 'Thursday Night at the Rite', path: '/thursday-night' },
  { icon: Users, label: 'My Contacts', path: '/contacts' },
  { icon: Compass, label: 'Pathfinder', path: '/' },
  { icon: PlusCircle, label: 'Create Ticket', path: '/create-ticket' },
  { icon: Ticket, label: 'My Tickets', path: '/my-tickets' },
  { icon: Award, label: 'Valley of Excellence', path: '#' },
  { icon: Settings, label: 'Mailing Preferences', path: '/mailing-preferences' },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-sidebar transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-heading font-bold text-lg">J</span>
              </div>
              <div>
                <h1 className="font-heading text-lg font-bold text-sidebar-foreground">Journey</h1>
                <span className="text-xs text-sidebar-foreground/60">365</span>
              </div>
            </Link>
            <button 
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Member Center Header */}
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2 text-sidebar-foreground/70 text-sm">
            <ChevronDown size={16} />
            <span className="uppercase tracking-wider font-medium">Member Center</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={onToggle}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50">
            Privacy Policy
          </p>
          <p className="text-xs text-sidebar-foreground/40 mt-2">
            © 2024 Scottish Rite<br />
            Supreme Council, AASR, NMJ, USA
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
