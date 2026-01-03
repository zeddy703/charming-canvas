import { useState, useEffect } from 'react';
import { Compass, Loader2 } from 'lucide-react';
import WaypointCard from './WaypointCard';

// Static list of waypoints (order MUST match API response array)
const WAYPOINTS = [
  { id: 'organization', title: 'ORGANIZATION', color: 'organization' as const },
  { id: 'self', title: 'SELF-IMPROVEMENT', color: 'self' as const },
  { id: 'valley', title: 'VALLEY LIFE', color: 'valley' as const },
  { id: 'enrichment', title: 'ENRICHMENT PROGRAMS', color: 'enrichment' as const },
  { id: 'service', title: 'SERVICE & PHILANTHROPY', color: 'service' as const },
  { id: 'choice', title: 'CHOICE', color: 'choice' as const },
];

const WaypointTracker = () => {
  const [progress, setProgress] = useState<Array<{ completed: number; total: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);

        const res = await fetch('http://localhost:3000/api/members-center/milestone/progress/stats', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const json = await res.json();
        console.log('Fetched waypoint progress:', json);

        if (!json.success || !Array.isArray(json.data)) {
          console.error('Invalid progress response');
          return;
        }

        // Map API array directly to our progress state
        // Each index corresponds to the waypoint in WAYPOINTS array
        setProgress(json.data.map((item: any) => ({
          completed: item.completed,
          total: item.totalActivities,
        })));
      } catch (err) {
        console.error('Failed to fetch waypoint progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center gap-2 mb-6">
        <Compass className="text-accent" size={24} />
        <h2 className="font-heading text-xl font-bold">Waypoint Tracker</h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {WAYPOINTS.map((_, index) => (
            <div
              key={index}
              className="h-56 bg-card/50 border border-border rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {WAYPOINTS.map((waypoint, index) => {
            const stats = progress[index] || { completed: 0, total: 0 };
            const remaining = stats.total - stats.completed;

            return (
              <WaypointCard
                key={waypoint.id}
                id={waypoint.id}
                title={waypoint.title}
                color={waypoint.color}
                completed={stats.completed}
                remaining={remaining}
                delay={100 * index}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WaypointTracker;