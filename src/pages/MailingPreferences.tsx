import { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  Mail,
  Bell,
  Calendar,
  Newspaper,
  Users,
  Award,
  Settings,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import apiRequest from '@/utils/api';

const iconMap: Record<string, any> = {
  newspaper: Newspaper,
  calendar: Calendar,
  bell: Bell,
  award: Award,
  users: Users,
  mail: Mail,
};

type PreferenceItem = {
  id: string;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
};

const MailingPreferences = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  const [preferences, setPreferences] = useState<PreferenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPreferences = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await apiRequest('/api/users/notifications/settings/preferences', {
        method: 'GET',
        showErrorToast: false,
      });

      if (!res.success) throw new Error(res.error);

      setPreferences(res.data);
    } catch (err) {
      const message = 'Failed to load preferences.';
      setError(message);
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
    fetchPreferences();
  }, [fetchPreferences]);

  const handlePreferenceChange = (id: string, checked: boolean) => {
    setPreferences(prev =>
      prev.map(p =>
        p.id === id ? { ...p, enabled: checked } : p
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = preferences.map(p => ({
        id: p.id,
        value: p.enabled,
      }));

      const res = await apiRequest('/api/users/notifications/settings/preferences/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { payload },
      });

      if (!res.success) throw new Error(res.error);

      toast({
        title: 'Preferences Saved',
        description: 'Your mailing preferences have been updated successfully.',
        variant: "success",
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || "Failed to save preferences",
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Skeleton loading state
  const renderSkeleton = () => (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <div className="progress-card">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                      <Skeleton className="h-4 w-64 mt-2 ml-7" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <Skeleton className="h-10 w-36" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  // Error state
  const renderError = () => (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Failed to Load Preferences</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => fetchPreferences()} variant="default">
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

  if (error && !loading) {
    return renderError();
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                  Mailing Preferences
                </h1>
                <p className="text-muted-foreground">
                  Manage your email subscriptions and communication preferences
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPreferences(true)}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Preferences Card */}
            <div className="progress-card animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Settings className="text-primary" size={24} />
                </div>
                <div>
                  <h2 className="font-heading font-semibold">Email Subscriptions</h2>
                  <p className="text-sm text-muted-foreground">
                    Choose which emails you'd like to receive
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {preferences.map((option, index) => {
                  const Icon = iconMap[option.icon];

                  return (
                    <div
                      key={option.id}
                      className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        {Icon && <Icon className="text-primary" size={20} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={option.id}
                            checked={option.enabled}
                            onCheckedChange={checked =>
                              handlePreferenceChange(option.id, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={option.id}
                            className="font-medium cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 ml-7">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Preferences'}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MailingPreferences;
