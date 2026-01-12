import { useState, useEffect } from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import apiRequest from '@/utils/api';
import NotificationDropdown from '@/components/NotificationDropdown';

interface HeaderProps {
  onMenuToggle: () => void;
}

interface UserProfile {
  firstName: string;
  avatarUrl?: string;
}

const tabs = [
  'ORGANIZATION',
  'SELF-IMPROVEMENT',
  'VALLEY LIFE',
  'ENRICHMENT PROGRAMS',
  'SERVICE & PHILANTHROPY',
  'CHOICE'
];

const Header = ({ onMenuToggle }: HeaderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiRequest<{ success: boolean; user: UserProfile }>(
          '/api/user/account/profile/info',
          { method: 'GET' }
        );

        if (response.success && response.user) {
          setUser({
            firstName: response.user.firstName,
            avatarUrl: response.user.avatarUrl || undefined,
          });
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        // Fallback to default name/photo
        setUser({ firstName: 'User' });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Initials fallback with colored background
  const getInitials = () => {
    if (!user?.firstName) return '??';
    return user.firstName.charAt(0).toUpperCase();
  };

  const colorClasses = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-pink-500',
  ];

  const getAvatarColor = () => {
    if (!user?.firstName) return colorClasses[0];
    const index = user.firstName.charCodeAt(0) % colorClasses.length;
    return colorClasses[index];
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-30">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-muted text-foreground"
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className="font-heading text-xl font-semibold text-foreground">
              Pathfinder | <span className="text-muted-foreground">Version 2026.2</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Path Selection */}
          <div className="hidden md:flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Path Selection</label>
            <select className="bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Path #1</option>
              <option>Path #2</option>
              <option>Path #3</option>
            </select>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <a href="#" className="text-sm text-primary hover:underline hidden sm:block">NMJ Login</a>
            <a href="#" className="text-sm text-primary hover:underline hidden sm:block">Logout</a>
            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <span className="text-sm font-medium">
                {loading ? 'Loading...' : `Hi, ${user?.firstName || 'User'}!`}
              </span>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-border flex items-center justify-center">
                {loading ? (
                  <div className="w-full h-full bg-muted animate-pulse" />
                ) : user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full ${getAvatarColor()} flex items-center justify-center`}>
                    <span className="text-lg font-bold text-white">
                      {getInitials()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="overflow-x-auto">
        <nav className="flex items-center px-4 py-2 gap-1 min-w-max">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wide
                transition-colors duration-200
                ${index === 0 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
            >
              <span className="w-4 h-4 rounded border-2 border-current flex items-center justify-center">
                {index === 0 && <span className="w-2 h-2 bg-current rounded-sm" />}
              </span>
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;