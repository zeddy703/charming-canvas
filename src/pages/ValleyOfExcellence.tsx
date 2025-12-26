import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Award, Trophy, Star, Medal, Crown, Target, Users, Calendar, CheckCircle, Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const achievements = [
  {
    id: 'pathfinder',
    name: 'Pathfinder Program',
    description: 'Complete all Pathfinder milestones',
    icon: Target,
    progress: 60,
    unlocked: false,
    tier: 'gold',
  },
  {
    id: 'degree-master',
    name: 'Degree Master',
    description: 'Witness all 29 Scottish Rite degrees',
    icon: Award,
    progress: 45,
    unlocked: false,
    tier: 'platinum',
  },
  {
    id: 'tnr-attendee',
    name: 'TNR Regular',
    description: 'Attend 10 Thursday Night at the Rite events',
    icon: Calendar,
    progress: 100,
    unlocked: true,
    tier: 'silver',
  },
  {
    id: 'community-builder',
    name: 'Community Builder',
    description: 'Refer 3 new members to the Valley',
    icon: Users,
    progress: 100,
    unlocked: true,
    tier: 'bronze',
  },
  {
    id: 'philanthropy',
    name: 'Philanthropist',
    description: 'Contribute to Scottish Rite charitable causes',
    icon: Medal,
    progress: 100,
    unlocked: true,
    tier: 'gold',
  },
  {
    id: 'leadership',
    name: 'Valley Leader',
    description: 'Serve in a Valley leadership position',
    icon: Crown,
    progress: 0,
    unlocked: false,
    tier: 'platinum',
  },
];

const recognitionBadges = [
  {
    id: 'member-5',
    name: '5 Year Member',
    description: 'Member for 5 consecutive years',
    icon: Star,
    unlocked: true,
    year: 2019,
  },
  {
    id: 'member-10',
    name: '10 Year Member',
    description: 'Member for 10 consecutive years',
    icon: Star,
    unlocked: false,
    year: null,
  },
  {
    id: 'first-degree',
    name: 'First Steps',
    description: 'Received your first Scottish Rite degree',
    icon: CheckCircle,
    unlocked: true,
    year: 2019,
  },
  {
    id: '32nd-degree',
    name: '32° Mason',
    description: 'Achieved the 32nd degree',
    icon: Trophy,
    unlocked: true,
    year: 2020,
  },
];

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

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  const unlockedBadges = recognitionBadges.filter(b => b.unlocked).length;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Valley of Excellence</h1>
              <p className="text-muted-foreground">Your achievements and recognition in Scottish Rite Masonry</p>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
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
                          
                          {!achievement.unlocked && achievement.progress > 0 && (
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
            </div>

            {/* Recognition Badges Section */}
            <div className="progress-card animate-fade-in" style={{ animationDelay: '400ms' }}>
              <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                <Award className="text-primary" size={24} />
                Recognition Badges
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recognitionBadges.map((badge, index) => {
                  const Icon = badge.icon;
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
