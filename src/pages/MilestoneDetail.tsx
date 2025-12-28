import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { milestones, Activity } from '@/data/milestones';
import ActivityOverlay from '@/components/ActivityOverlay';

const colorClasses = {
  organization: 'bg-progress-organization',
  self: 'bg-progress-self',
  valley: 'bg-progress-valley',
  enrichment: 'bg-progress-enrichment',
  service: 'bg-progress-service',
  choice: 'bg-progress-choice',
};

const MilestoneDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const milestone = milestones.find(m => m.id === id);
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
  useEffect(() => {
    if (milestone) {
      // Load from localStorage or use default
      const saved = localStorage.getItem(`milestone-${id}`);
      if (saved) {
        setActivities(JSON.parse(saved));
      } else {
        setActivities(milestone.activities);
      }
    }
  }, [id, milestone]);
  
  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const handleCompleteActivity = (activityId: string) => {
    const updated = activities.map(a => 
      a.id === activityId ? { ...a, completed: true } : a
    );
    setActivities(updated);
    localStorage.setItem(`milestone-${id}`, JSON.stringify(updated));
    setSelectedActivity(null);
  };

  const handleCloseOverlay = () => {
    setSelectedActivity(null);
  };
  
  if (!milestone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Milestone not found</p>
      </div>
    );
  }
  
  const completedCount = activities.filter(a => a.completed).length;
  const progress = activities.length > 0 ? (completedCount / activities.length) * 100 : 0;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className={`${colorClasses[milestone.color]} py-6 px-4`}>
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground">
            {milestone.title}
          </h1>
          <p className="text-primary-foreground/80 mt-2">
            {completedCount} of {activities.length} activities completed
          </p>
          
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-foreground rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Activities List */}
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <p className="text-muted-foreground mb-6 text-center">
          Click on an activity to view details and mark it as complete
        </p>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={activity.id}
              className="activity-card animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleActivityClick(activity)}
            >
              <div className="flex items-start gap-4">
                <div 
                  className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 ${
                    activity.completed 
                      ? 'bg-primary border-primary' 
                      : 'border-muted-foreground/30'
                  }`}
                >
                  {activity.completed && (
                    <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p 
                    className={`block text-lg font-medium transition-colors ${
                      activity.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}
                  >
                    {activity.title}
                  </p>
                  <p className={`text-sm mt-1 ${
                    activity.completed ? 'text-muted-foreground/60' : 'text-muted-foreground'
                  }`}>
                    {activity.description}
                  </p>
                </div>
                {activity.completed && (
                  <CheckCircle2 className="text-primary shrink-0" size={24} />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {completedCount === activities.length && activities.length > 0 && (
          <div className="mt-8 text-center p-6 bg-primary/10 rounded-xl border border-primary/20 animate-fade-in">
            <CheckCircle2 className="mx-auto text-primary mb-3" size={48} />
            <h3 className="text-xl font-heading font-bold text-foreground">
              Milestone Complete!
            </h3>
            <p className="text-muted-foreground mt-2">
              Congratulations on completing all activities in this milestone.
            </p>
          </div>
        )}
      </div>

      {/* Activity Overlay */}
      {selectedActivity && (
        <ActivityOverlay
          activity={selectedActivity}
          onClose={handleCloseOverlay}
          onComplete={handleCompleteActivity}
        />
      )}
    </div>
  );
};

export default MilestoneDetail;
