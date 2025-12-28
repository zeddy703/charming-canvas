import { ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    // Small delay for loading effect
    await new Promise(resolve => setTimeout(resolve, 600));
    navigate(`/milestone/${id}`);
  };
  
  return (
    <div 
      className="progress-card animate-fade-in cursor-pointer hover:scale-[1.02] transition-transform relative"
      style={{ animationDelay: `${delay}ms` }}
      onClick={handleClick}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-card/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

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
