import { ChevronDown } from 'lucide-react';

interface WaypointCardProps {
  title: string;
  completed: number;
  remaining: number;
  color: 'organization' | 'self' | 'valley' | 'enrichment' | 'service' | 'choice';
  delay?: number;
}

const colorClasses = {
  organization: 'bg-progress-organization',
  self: 'bg-progress-self',
  valley: 'bg-progress-valley',
  enrichment: 'bg-progress-enrichment',
  service: 'bg-progress-service',
  choice: 'bg-progress-choice',
};

const WaypointCard = ({ title, completed, remaining, color, delay = 0 }: WaypointCardProps) => {
  return (
    <div 
      className="progress-card animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className={`waypoint-header ${colorClasses[color]} flex items-center justify-between mb-4`}>
        <span>{title}</span>
        <ChevronDown size={16} />
      </div>

      {/* Stats */}
      <div className="text-center">
        <div className="text-4xl font-heading font-bold text-foreground mb-1 animate-count-up" style={{ animationDelay: `${delay + 200}ms` }}>
          {completed}
        </div>
        <p className="text-sm text-muted-foreground uppercase tracking-wide">
          Completed
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {remaining} Remaining
        </p>
      </div>
    </div>
  );
};

export default WaypointCard;
