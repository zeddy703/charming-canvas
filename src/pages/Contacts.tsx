import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Users, Mail, Phone, MapPin, Search, Crown, Shield, Star, RefreshCw, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import apiRequest from '@/utils/api';

type ContactPerson = {
  name: string;
  title: string;
  email: string;
  phone: string;
};

type ValleyInfo = {
  name: string;
  subtitle: string;
  address: string;
};

type ContactsData = {
  valleyInfo: ValleyInfo;
  leadership: ContactPerson[];
  officers: ContactPerson[];
};

// Fallback static data
const fallbackData: ContactsData = {
  valleyInfo: {
    name: "Valley of Boston",
    subtitle: "Ancient Accepted Scottish Rite, NMJ",
    address: "186 Tremont Street, Boston, MA 02111",
  },
  leadership: [
    { name: "Robert Anderson", title: "Thrice Potent Master", email: "randerson@email.com", phone: "(555) 234-5678" },
    { name: "William Thompson", title: "Sovereign Prince", email: "wthompson@email.com", phone: "(555) 345-6789" },
    { name: "James Wilson", title: "Most Wise Master", email: "jwilson@email.com", phone: "(555) 456-7890" },
    { name: "Michael Brown", title: "Commander-in-Chief", email: "mbrown@email.com", phone: "(555) 567-8901" },
  ],
  officers: [
    { name: "David Miller", title: "Secretary", email: "dmiller@email.com", phone: "(555) 678-9012" },
    { name: "Charles Davis", title: "Treasurer", email: "cdavis@email.com", phone: "(555) 789-0123" },
    { name: "Thomas Martinez", title: "Almoner", email: "tmartinez@email.com", phone: "(555) 890-1234" },
  ],
};

const Contacts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [contactsData, setContactsData] = useState<ContactsData | null>(null);
  const { toast } = useToast();

  const fetchContacts = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await apiRequest('/api/valley/contacts', {
        method: 'GET',
        showErrorToast: false,
      });

      if (!res.success) throw new Error(res.error);

      setContactsData(res.data);
    } catch (err) {
      // Use fallback data on error
      setContactsData(fallbackData);
      const message = 'Failed to load contacts. Showing cached data.';
      if (isRefresh) {
        toast({
          title: 'Refresh Failed',
          description: message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const data = contactsData || fallbackData;

  // Skeleton loading state
  const renderSkeleton = () => (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header skeleton */}
            <div className="mb-8 flex items-start justify-between">
              <div>
                <Skeleton className="h-9 w-40 mb-2" />
                <Skeleton className="h-5 w-64" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>

            {/* Search skeleton */}
            <Skeleton className="h-10 w-full mb-6" />

            {/* Valley Info skeleton */}
            <div className="progress-card mb-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64 mb-2" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
            </div>

            {/* Leadership skeleton */}
            <div className="progress-card mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-start gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-40 mb-2" />
                        <Skeleton className="h-4 w-48 mb-1" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Officers skeleton */}
            <div className="progress-card">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-28 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-9 rounded-lg" />
                      <Skeleton className="h-9 w-9 rounded-lg" />
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

  // Error state (no fallback available)
  const renderError = () => (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Failed to Load Contacts</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => fetchContacts()} variant="default">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </main>
      </div>
    </div>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (error && !contactsData) {
    return renderError();
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Contacts</h1>
                <p className="text-muted-foreground">Valley directory and leadership contacts</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchContacts(true)}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
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
                  <h2 className="font-heading text-xl font-bold text-foreground">{data.valleyInfo.name}</h2>
                  <p className="text-muted-foreground">{data.valleyInfo.subtitle}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    <span>{data.valleyInfo.address}</span>
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
                {data.leadership.map((person, index) => (
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
                {data.officers.map((person, index) => (
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
