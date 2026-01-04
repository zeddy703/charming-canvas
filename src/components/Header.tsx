import { Menu, LogOut, User } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
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
            <a href="#" className="text-sm text-primary hover:underline hidden sm:block">NMJ Login</a>
            <a href="#" className="text-sm text-primary hover:underline hidden sm:block">Logout</a>
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <span className="text-sm font-medium">Hi, Zedekiah!</span>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User size={16} className="text-primary-foreground" />
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
