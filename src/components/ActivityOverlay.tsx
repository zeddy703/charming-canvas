import { X, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Activity } from '@/data/milestones';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

interface ActivityOverlayProps {
  activity: Activity;
  onClose: () => void;
  onComplete: (activityId: string, updatedActivities?: any[]) => void;
}

// Content mapping for each activity
const activityContent: Record<string, { title: string; content: string[] }> = {
  'org-1': {
    title: 'Lodge Meeting Guidelines',
    content: [
      'A Lodge meeting is a formal gathering of Freemasons where business is conducted and ritual work may be performed.',
      'During your visit, observe the following:',
      '• Arrive at least 15 minutes before the stated time',
      '• Dress appropriately in business attire',
      '• Turn off all electronic devices',
      '• Stand when the Worshipful Master stands',
      '• Do not cross between the Altar and the East',
      '• Listen attentively to all proceedings',
      '• Take mental notes of the officers and their roles',
    ]
  },
  'org-2': {
    title: 'Lodge Officers and Their Duties',
    content: [
      'The principal officers of a Lodge are:',
      '• Worshipful Master - Presides over the Lodge',
      '• Senior Warden - Assists the Master, represents the West',
      '• Junior Warden - Responsible for refreshment, represents the South',
      '• Treasurer - Manages Lodge finances',
      '• Secretary - Maintains records and correspondence',
      '• Senior Deacon - Attends the Worshipful Master',
      '• Junior Deacon - Attends the Senior Warden',
      '• Senior Steward - Assists with candidates',
      '• Junior Steward - Prepares the Lodge for meetings',
      '• Tyler - Guards the door of the Lodge',
    ]
  },
  'org-3': {
    title: 'Lodge Bylaws',
    content: [
      'The Bylaws of the Lodge govern its operations and membership.',
      'Key areas covered by Lodge Bylaws include:',
      '• Membership requirements and dues structure',
      '• Meeting times and locations',
      '• Election of officers and their terms',
      '• Voting procedures and quorum requirements',
      '• Discipline and grievance procedures',
      '• Amendment procedures for the bylaws',
      'Every member should have a copy of the bylaws and be familiar with their contents.',
      'The bylaws are subordinate to the Constitution and Regulations of the Grand Lodge.',
    ]
  },
  'org-4': {
    title: 'District Leadership',
    content: [
      'District Officers serve as liaisons between individual Lodges and the Grand Lodge.',
      'Key District positions include:',
      '• District Deputy Grand Master - Primary representative of the Grand Master',
      '• District Education Officer - Promotes Masonic education',
      '• District Instructor - Assists with ritual work',
      'Meeting district officers helps you understand the broader Masonic structure.',
      'They are valuable resources for questions about Masonic law and custom.',
    ]
  },
};

// Default content for activities without specific content
const defaultContent = {
  title: 'Activity Information',
  content: [
    'This activity is designed to help you grow as a Mason.',
    'Take your time to complete this activity thoughtfully.',
    'Consult with your mentor if you have questions.',
    'Document your experience for future reflection.',
  ]
};

const ActivityOverlay = ({ activity, onClose, onComplete }: ActivityOverlayProps) => {
  const { id: milestoneId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const content = activityContent[activity.id] || defaultContent;

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:3000/api/members-center/milestone/progress", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          milestoneId,
          activityId: activity.id,
        }),
      });

      const json = await res.json();
      console.log("Activity completion response:", json);
      
      // Find updated milestone and pass activities back to parent
      const updatedMilestone = json?.data?.milestones?.find((m: any) => m.id === milestoneId);
      onComplete(activity.id, updatedMilestone?.activities);
    } catch (err) {
      console.error("Failed to complete activity:", err);
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
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-1 rounded-full hover:bg-primary-foreground/10"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">
              {content.title}
            </h3>
            
            <div className="space-y-4">
              {content.content.map((paragraph, index) => (
                <p 
                  key={index} 
                  className="text-foreground/80 leading-relaxed text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 p-6 bg-muted rounded-xl border border-border">
              <p className="text-muted-foreground italic">
                "{activity.description}"
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 bg-card">
          <div className="max-w-3xl mx-auto flex justify-end gap-4">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleComplete}
              disabled={isSubmitting || activity.completed}
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
