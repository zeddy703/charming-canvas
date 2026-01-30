import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VideoPlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    name: string;
    degree: string;
    videoUrl?: string;
  } | null;
}

const VideoPlayerDialog = ({ isOpen, onClose, event }: VideoPlayerDialogProps) => {
  if (!event) return null;

  // Placeholder video URL - replace with actual video URL from your API
  const videoUrl = event.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="font-heading text-lg">
            {event.degree}° - {event.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 pt-2">
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video
              className="w-full h-full"
              controls
              autoPlay
              controlsList="nodownload"
              playsInline
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerDialog;
