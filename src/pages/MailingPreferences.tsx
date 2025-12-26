import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Mail, Bell, Calendar, Newspaper, Users, Award, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const mailingOptions = [
  {
    id: 'newsletter',
    label: 'Monthly Newsletter',
    description: 'Receive our monthly Scottish Rite newsletter with updates and news',
    icon: Newspaper,
  },
  {
    id: 'events',
    label: 'Event Notifications',
    description: 'Get notified about upcoming Valley events and degree work',
    icon: Calendar,
  },
  {
    id: 'tnr',
    label: 'Thursday Night at the Rite',
    description: 'Reminders for bi-weekly online degree presentations',
    icon: Bell,
  },
  {
    id: 'pathfinder',
    label: 'Pathfinder Progress Updates',
    description: 'Updates about your Pathfinder journey and new opportunities',
    icon: Award,
  },
  {
    id: 'leadership',
    label: 'Leadership Communications',
    description: 'Important messages from Valley and Supreme Council leadership',
    icon: Users,
  },
  {
    id: 'dues',
    label: 'Dues & Payment Reminders',
    description: 'Reminders about upcoming dues and payment confirmations',
    icon: Mail,
  },
];

const MailingPreferences = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    newsletter: true,
    events: true,
    tnr: true,
    pathfinder: true,
    leadership: true,
    dues: true,
  });

  const handlePreferenceChange = (id: string, checked: boolean) => {
    setPreferences(prev => ({ ...prev, [id]: checked }));
  };

  const handleSave = () => {
    toast({
      title: "Preferences Saved",
      description: "Your mailing preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Mailing Preferences</h1>
              <p className="text-muted-foreground">Manage your email subscriptions and communication preferences</p>
            </div>

            {/* Preferences Card */}
            <div className="progress-card animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Settings className="text-primary" size={24} />
                </div>
                <div>
                  <h2 className="font-heading font-semibold">Email Subscriptions</h2>
                  <p className="text-sm text-muted-foreground">Choose which emails you'd like to receive</p>
                </div>
              </div>

              <div className="space-y-4">
                {mailingOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <div 
                      key={option.id}
                      className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="text-primary" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            id={option.id}
                            checked={preferences[option.id]}
                            onCheckedChange={(checked) => handlePreferenceChange(option.id, checked as boolean)}
                          />
                          <Label htmlFor={option.id} className="font-medium text-foreground cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 ml-7">{option.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <Button onClick={handleSave} className="w-full sm:w-auto">
                  Save Preferences
                </Button>
              </div>
            </div>

            {/* Email Frequency */}
            <div className="progress-card mt-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h3 className="font-heading text-lg font-semibold mb-4">Email Frequency</h3>
              <p className="text-muted-foreground text-sm mb-4">
                You can unsubscribe from all non-essential emails at any time. Essential communications 
                regarding your membership status and account security will always be sent.
              </p>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                Unsubscribe from All Marketing Emails
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MailingPreferences;
