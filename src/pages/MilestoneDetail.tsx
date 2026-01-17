import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import ActivityOverlay from "@/components/ActivityOverlay";
import apiRequest from "@/utils/api";
const colorClasses = {
  organization: "bg-progress-organization",
  self: "bg-progress-self",
  valley: "bg-progress-valley",
  enrichment: "bg-progress-enrichment",
  service: "bg-progress-service",
  choice: "bg-progress-choice",
};

const MilestoneDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [milestone, setMilestone] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  // Fetch initial progress
  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await apiRequest<any>("/api/members-center/milestone/progress", {
        method: "POST",
        body: { milestoneId: id },
      });
      if (res.success && res?.data) {
        const found = res.data;
        if (found) {
          setMilestone(found);
          setActivities(found.activities);
        }
      }
    } catch (err) {
      console.error("Failed to fetch milestone progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [id]);

  // Optimistic update when activity is completed from overlay
  const handleActivityComplete = (activityId: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, completed: true }
          : activity
      )
    );

    // Optional: Update milestone title/progress if needed (but derived below)
    setSelectedActivity(null); // Close overlay
  };

  // Handlers for overlay
  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity);
  };

  const handleCloseOverlay = () => {
    setSelectedActivity(null);
  };

  // Derived values
  const completedCount = activities.filter(a => a.completed).length;
  const progress = activities.length > 0 ? (completedCount / activities.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading progress…</p>
      </div>
    );
  }

  if (!milestone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Milestone not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className={`${colorClasses[milestone.color]} py-6 px-4`}>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {milestone.title}
          </h1>

          <p className="text-white/80 mt-2">
            {completedCount} of {activities.length} activities completed
          </p>

          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500 ease-out"
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
              className="activity-card bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleActivityClick(activity)}
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={activity.completed}
                  disabled={activity.completed}
                  className="mt-1 h-5 w-5"
                  onClick={(e) => e.stopPropagation()}
                />

                <div className="flex-1">
                  <label
                    className={`block text-lg font-medium transition-colors ${
                      activity.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {activity.title}
                  </label>

                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                </div>

                {activity.completed && (
                  <CheckCircle2 className="text-primary flex-shrink-0" size={24} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Milestone Complete Celebration */}
        {completedCount === activities.length && activities.length > 0 && (
          <div className="mt-12 text-center p-8 bg-primary/10 rounded-2xl border border-primary/20">
            <CheckCircle2 className="mx-auto text-primary mb-4 animate-bounce" size={64} />
            <h3 className="text-2xl font-bold text-foreground">Milestone Complete!</h3>
            <p className="text-muted-foreground mt-3 text-lg">
              Congratulations! You've successfully completed all activities in this milestone.
            </p>
          </div>
        )}
      </div>

      {/* Activity Overlay */}
      {selectedActivity && (
        <ActivityOverlay
          activity={selectedActivity}
          onClose={handleCloseOverlay}
          onComplete={handleActivityComplete} // This triggers instant UI update
        />
      )}
    </div>
  );
};

export default MilestoneDetail;