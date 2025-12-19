import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Users, Mail, Phone, MapPin, Search, Crown, Shield, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';

const valleyLeadership = [
  { name: "Robert Anderson", title: "Thrice Potent Master", email: "randerson@email.com", phone: "(555) 234-5678" },
  { name: "William Thompson", title: "Sovereign Prince", email: "wthompson@email.com", phone: "(555) 345-6789" },
  { name: "James Wilson", title: "Most Wise Master", email: "jwilson@email.com", phone: "(555) 456-7890" },
  { name: "Michael Brown", title: "Commander-in-Chief", email: "mbrown@email.com", phone: "(555) 567-8901" },
];

const valleyContacts = [
  { name: "David Miller", title: "Secretary", email: "dmiller@email.com", phone: "(555) 678-9012" },
  { name: "Charles Davis", title: "Treasurer", email: "cdavis@email.com", phone: "(555) 789-0123" },
  { name: "Thomas Martinez", title: "Almoner", email: "tmartinez@email.com", phone: "(555) 890-1234" },
];

const Contacts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Contacts</h1>
              <p className="text-muted-foreground">Valley directory and leadership contacts</p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input 
                placeholder="Search contacts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Valley Info */}
            <div className="progress-card mb-6 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="text-primary" size={32} />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">Valley of Boston</h2>
                  <p className="text-muted-foreground">Ancient Accepted Scottish Rite, NMJ</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    <span>186 Tremont Street, Boston, MA 02111</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Leadership */}
            <div className="progress-card mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                <Crown className="text-accent" size={20} />
                Valley Leadership
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {valleyLeadership.map((person, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-muted/30 rounded-lg border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Star className="text-accent" size={18} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-heading font-semibold text-foreground">{person.name}</h4>
                        <p className="text-sm text-primary font-medium">{person.title}</p>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <a href={`mailto:${person.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                            <Mail size={14} />
                            {person.email}
                          </a>
                          <a href={`tel:${person.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                            <Phone size={14} />
                            {person.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Contacts */}
            <div className="progress-card animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="text-primary" size={20} />
                Valley Officers
              </h3>
              
              <div className="space-y-3">
                {valleyContacts.map((person, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="text-primary" size={18} />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{person.name}</h4>
                        <p className="text-sm text-muted-foreground">{person.title}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={`mailto:${person.email}`}
                        className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Mail size={18} />
                      </a>
                      <a 
                        href={`tel:${person.phone}`}
                        className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Phone size={18} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Contacts;
