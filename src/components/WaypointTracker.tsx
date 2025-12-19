import { Compass } from 'lucide-react';
import WaypointCard from './WaypointCard';

const waypoints = [
  { id: 'organization', title: 'ORGANIZATION', completed: 1, remaining: 5, color: 'organization' as const },
  { id: 'self', title: 'SELF-IMPROVEMENT', completed: 2, remaining: 4, color: 'self' as const },
  { id: 'valley', title: 'VALLEY LIFE', completed: 2, remaining: 4, color: 'valley' as const },
  { id: 'enrichment', title: 'ENRICHMENT PROGRAMS', completed: 1, remaining: 5, color: 'enrichment' as const },
  { id: 'service', title: 'SERVICE & PHILANTHROPY', completed: 3, remaining: 3, color: 'service' as const },
  { id: 'choice', title: 'CHOICE', completed: 0, remaining: 2, color: 'choice' as const },
];

const WaypointTracker = () => {
  return (
    <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center gap-2 mb-4">
        <Compass className="text-accent" size={20} />
        <h2 className="font-heading text-lg font-semibold">Waypoint Tracker</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {waypoints.map((waypoint, index) => (
          <WaypointCard
            key={waypoint.id}
            {...waypoint}
            delay={100 * index}
          />
        ))}
      </div>
    </div>
  );
};

export default WaypointTracker;
