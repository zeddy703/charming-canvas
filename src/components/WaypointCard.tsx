import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WaypointCardProps {
  id: string;
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

const WaypointCard = ({ id, title, completed, remaining, color, delay = 0 }: WaypointCardProps) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="progress-card animate-fade-in cursor-pointer hover:scale-[1.02] transition-transform"
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => navigate(`/milestone/${id}`)}
    >
      {/* Header */}
      <div className={`waypoint-header ${colorClasses[color]} flex items-center justify-between mb-4`}>
        <span>{title}</span>
        <ChevronRight size={16} />
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
