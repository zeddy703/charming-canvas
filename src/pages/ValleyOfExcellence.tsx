import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Award, Trophy, Star, Medal, Crown, Target, Users, Calendar, CheckCircle, Lock, LucideIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import apiRequest from '@/utils/api';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  unlocked: boolean;
  tier: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  year: number | null;
}

interface AchievementsSummary {
  success: boolean;
  data: {
    achievements: Achievement[];
    badges: Badge[];
  };
}

const iconMap: Record<string, LucideIcon> = {
  Target,
  Award,
  Calendar,
  Users,
  Medal,
  Crown,
  Star,
  CheckCircle,
  Trophy,
};

const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Star;
};

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'bronze':
      return 'from-amber-600 to-amber-800';
    case 'silver':
      return 'from-slate-300 to-slate-500';
    case 'gold':
      return 'from-yellow-400 to-yellow-600';
    case 'platinum':
      return 'from-purple-400 to-purple-600';
    default:
      return 'from-primary to-primary';
  }
};

const getTierBorder = (tier: string) => {
  switch (tier) {
    case 'bronze':
      return 'border-amber-600/50';
    case 'silver':
      return 'border-slate-400/50';
    case 'gold':
      return 'border-yellow-500/50';
    case 'platinum':
      return 'border-purple-500/50';
    default:
      return 'border-primary/50';
  }
};

const ValleyOfExcellence = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAchievements = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const res: AchievementsSummary = await apiRequest('/api/me/achievements-summary', {
        method: 'GET',
        showErrorToast: false,
      });
      if (res?.success && res?.data) {
        setAchievements(res.data.achievements || []);
        setBadges(res.data.badges || []);
      } else if (!res?.success) {
        throw new Error('Failed to load achievements data');
      }
    } catch (err) {
      console.error('Failed to fetch achievements:', err);
      const errorMessage = 'Unable to load achievements. Please try again.';
      setError(errorMessage);
      if (isRefresh) {
        toast({
          title: 'Refresh Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  const unlockedBadges = badges.filter(b => b.unlocked).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <Skeleton className="h-9 w-64 mb-2" />
                <Skeleton className="h-5 w-96" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-96 rounded-xl mb-6" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertCircle className="text-destructive" size={32} />
                </div>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Failed to Load Achievements</h2>
                <p className="text-muted-foreground max-w-md mb-6">{error}</p>
                <Button onClick={() => fetchAchievements()} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Try Again
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Valley of Excellence</h1>
                <p className="text-muted-foreground">Your achievements and recognition in Scottish Rite Masonry</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchAchievements(true)}
                disabled={refreshing}
                className="self-start sm:self-auto"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="progress-card animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <Trophy className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-heading font-bold">{unlockedAchievements}/{totalAchievements}</p>
                    <p className="text-sm text-muted-foreground">Achievements</p>
                  </div>
                </div>
              </div>
              
              <div className="progress-card animate-fade-in" style={{ animationDelay: '50ms' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <Medal className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-heading font-bold">{unlockedBadges}</p>
                    <p className="text-sm text-muted-foreground">Badges Earned</p>
                  </div>
                </div>
              </div>
              
              <div className="progress-card animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <Star className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-heading font-bold">5</p>
                    <p className="text-sm text-muted-foreground">Years of Service</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="progress-card mb-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
              <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                <Trophy className="text-primary" size={24} />
                Achievements
              </h2>
              
              {achievements.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Trophy className="text-muted-foreground" size={32} />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">No Achievements Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Start your journey by participating in Valley activities to unlock achievements.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => {
                    const Icon = getIcon(achievement.icon);
                    return (
                      <div
                        key={achievement.id}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 animate-fade-in ${
                          achievement.unlocked 
                            ? `${getTierBorder(achievement.tier)} bg-gradient-to-br from-muted/30 to-muted/10 hover:scale-[1.02]` 
                            : 'border-border bg-muted/20 opacity-60'
                        }`}
                        style={{ animationDelay: `${200 + index * 50}ms` }}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                            achievement.unlocked 
                              ? `bg-gradient-to-br ${getTierColor(achievement.tier)}` 
                              : 'bg-muted'
                          }`}>
                            {achievement.unlocked ? (
                              <Icon className="text-white" size={28} />
                            ) : (
                              <Lock className="text-muted-foreground" size={24} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-heading font-semibold text-foreground">{achievement.name}</h3>
                              {achievement.unlocked && (
                                <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${getTierColor(achievement.tier)} text-white font-medium capitalize`}>
                                  {achievement.tier}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                            
                            {!achievement.unlocked && 'progress' in achievement && (
                              <div className="mt-3">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Progress</span>
                                  <span>{achievement.progress}%</span>
                                </div>
                                <Progress value={achievement.progress} className="h-2" />
                              </div>
                            )}
                            
                            {achievement.unlocked && (
                              <div className="mt-2 flex items-center gap-1 text-primary">
                                <CheckCircle size={16} />
                                <span className="text-sm font-medium">Completed</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recognition Badges Section */}
            <div className="progress-card animate-fade-in" style={{ animationDelay: '400ms' }}>
              <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                <Award className="text-primary" size={24} />
                Recognition Badges
              </h2>
              
              {badges.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Award className="text-muted-foreground" size={32} />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">No Badges Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Badges are awarded for special milestones and years of dedicated service.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {badges.map((badge, index) => {
                    const Icon = getIcon(badge.icon);
                    return (
                      <div
                        key={badge.id}
                        className={`relative p-4 rounded-xl text-center transition-all duration-300 animate-fade-in ${
                          badge.unlocked 
                            ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 hover:scale-105 hover:shadow-lg hover:shadow-primary/20' 
                            : 'bg-muted/30 border-2 border-border opacity-50'
                        }`}
                        style={{ animationDelay: `${450 + index * 50}ms` }}
                      >
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                          badge.unlocked 
                            ? 'bg-gradient-to-br from-primary to-primary/70' 
                            : 'bg-muted'
                        }`}>
                          {badge.unlocked ? (
                            <Icon className="text-white" size={32} />
                          ) : (
                            <Lock className="text-muted-foreground" size={24} />
                          )}
                        </div>
                        <h3 className="font-heading font-semibold text-sm text-foreground">{badge.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                        {badge.unlocked && badge.year && (
                          <p className="text-xs text-primary font-medium mt-2">Earned {badge.year}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Encouragement Card */}
            <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Star className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">Keep Growing!</h3>
                  <p className="text-sm text-muted-foreground">
                    You're on your way to becoming a distinguished member. Complete more milestones and participate in Valley activities to unlock new achievements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ValleyOfExcellence;
