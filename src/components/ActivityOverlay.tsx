import { X, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Activity } from '@/data/milestones';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface ActivityOverlayProps {
  activity: Activity;
  onClose: () => void;
  onComplete: (activityId: string) => void;
}

interface ActivityDetails {
  title: string;
  content: string[];
}

const ActivityOverlay = ({ activity, onClose, onComplete }: ActivityOverlayProps) => {
  const { id: milestoneId } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [details, setDetails] = useState<ActivityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:3000/api/members-center/milestone/progress/activity/${activity.id}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error('Invalid response format');
        }

        const { title, content } = result.data;

        setDetails({
          title: title || 'Activity Information',
          content: Array.isArray(content) ? content : [],
        });
      } catch (err) {
        console.error('Failed to fetch activity details:', err);
        setError('Unable to load activity details. Please try again later.');

        // Fallback content
        setDetails({
          title: 'Activity Information',
          content: [
            'This activity is designed to help you grow as a Mason.',
            'Take your time to complete this activity thoughtfully.',
            'Consult with your mentor if you have questions.',
            'Document your experience for future reflection.',
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDetails();
  }, [activity.id]);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3000/api/members-center/milestone/progress`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          milestoneId: milestoneId,
          activityId: activity.id,
        }),
      });
      console.log("sending request, milestoneId:", milestoneId, "activityId:", activity.id);
      if (!res.ok) throw new Error('Failed to complete activity');

      const json = await res.json();
      if (json.success) {
        console.log("Activity marked as complete successfully.");
        onComplete(activity.id);
        
      }

  
    } catch (err) {
      console.error("Failed to complete activity:", err);
      // Optionally show a toast/notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-4 md:inset-10 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="text-primary-foreground" size={24} />
            <h2 className="text-xl font-heading font-bold text-primary-foreground">
              {activity.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading || isSubmitting}
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-1 rounded-full hover:bg-primary-foreground/10 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading activity details...</p>
              </div>
            ) : error && !details ? (
              <div className="flex flex-col items-center justify-center py-16 text-destructive">
                <AlertCircle className="h-8 w-8 mb-4" />
                <p>{error}</p>
              </div>
            ) : details ? (
              <>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-8">
                  {details.title}
                </h3>

                <div className="space-y-4 text-lg text-foreground/80 leading-relaxed">
                  {details.content.map((paragraph, index) => {
                    const trimmed = paragraph.trim();
                    const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*');

                    return (
                      <p key={index}>
                        {isBullet ? (
                          <span className="inline-block ml-8">
                            • {trimmed.replace(/^[-•*]\s*/, '')}
                          </span>
                        ) : (
                          trimmed
                        )}
                      </p>
                    );
                  })}
                </div>

                {/* Optional: Keep the short description quote if it exists */}
                {activity.description && (
                  <div className="mt-10 p-6 bg-muted rounded-xl border border-border">
                    <p className="text-muted-foreground italic">
                      "{activity.description}"
                    </p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 bg-card">
          <div className="max-w-3xl mx-auto flex justify-end gap-4">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting || loading}>
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              disabled={isSubmitting || activity.completed || loading}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : activity.completed ? (
                'Already Completed'
              ) : (
                'Mark as Complete'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityOverlay;