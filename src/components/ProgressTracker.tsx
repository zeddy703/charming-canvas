import { TrendingUp } from 'lucide-react';

const ProgressTracker = () => {
  const completed = 9;
  const total = 32;
  const percentage = (completed / total) * 100;

  return (
    <div className="progress-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-primary" size={20} />
        <h2 className="font-heading text-lg font-semibold">My Pathfinder Progress</h2>
      </div>

      <div className="relative">
        {/* Progress Bar Background */}
        <div className="h-16 bg-muted rounded-lg overflow-hidden">
          {/* Progress Fill */}
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out flex items-center justify-center"
            style={{ width: `${percentage}%` }}
          >
            <span className="text-2xl font-heading font-bold text-primary-foreground animate-count-up">
              {completed} / {total}
            </span>
          </div>
        </div>

        {/* Label */}
        <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wide">
          Mile Markers Completed
        </p>
      </div>
    </div>
  );
};

export default ProgressTracker;
