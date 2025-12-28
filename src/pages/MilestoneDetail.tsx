import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const colorClasses = {
  organization: "bg-progress-organization",
  self: "bg-progress-self",
  valley: "bg-progress-valley",
  enrichment: "bg-progress-enrichment",
  service: "bg-progress-service",
  choice: "bg-progress-choice",
};

const MilestoneDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [milestone, setMilestone] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch progress from API
  const fetchProgress = async () => {
    console.log("Fetching milestone progress for id:", id);
    try {

      const res = await fetch("http://localhost:3000/api/members-center/milestone/progress", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({milestoneId: id}), // no activityId on load
      });

      const json = await res.json();
      console.log("Received milestone progress data:", json);

      if (!json?.data?.milestones) return;

      const found = json.data.milestones.find(
        (m) => m.id === id
      );


      if (found) {
        setMilestone(found);
        setActivities(found.activities);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [id]);

  // 🔹 Complete activity via API
  const toggleActivity = async (activityId) => {
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          milestoneId: id,
          activityId,
        }),
      });

      const json = await res.json();

      if (!json?.data?.milestones) return;

      const updated = json.data.milestones.find(
        (m) => m.id === id
      );

      if (updated) {
        setActivities(updated.activities);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading progress…</p>
      </div>
    );
  }

  // 🔹 Milestone not found
  if (!milestone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Milestone not found</p>
      </div>
    );
  }

  const completedCount = activities.filter((a) => a.completed).length;
  const progress =
    activities.length > 0
      ? (completedCount / activities.length) * 100
      : 0;

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

          {/* Progress bar */}
          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Activities */}
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
                <Checkbox
                  id={activity.id}
                  checked={activity.completed}
                  disabled={activity.completed}
                  onCheckedChange={() =>
                    toggleActivity(activity.id)
                  }
                  className="mt-1 h-5 w-5"
                />

                <div className="flex-1">
                  <label
                    htmlFor={activity.id}
                    className={`block text-lg font-medium ${
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
                  <CheckCircle2
                    className="text-primary"
                    size={24}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Completion message */}
        {completedCount === activities.length &&
          activities.length > 0 && (
            <div className="mt-8 text-center p-6 bg-primary/10 rounded-xl border">
              <CheckCircle2
                className="mx-auto text-primary mb-3"
                size={48}
              />
              <h3 className="text-xl font-bold">
                Milestone Complete!
              </h3>
              <p className="text-muted-foreground mt-2">
                Congratulations on completing all activities.
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
