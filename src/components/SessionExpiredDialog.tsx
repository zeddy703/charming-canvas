import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface SessionExpiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loginUrl?: string;
}

const SessionExpiredDialog = ({ 
  open, 
  onOpenChange,
  loginUrl ="http://localhost:3000/actions/social-login/auth/login?redirect=63ab42acbe1008c46bae760317da154175c5e18250cfcbeae7a96f64710d8302/after-login&amp;provider=j365", 
}: SessionExpiredDialogProps) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!open) {
      setCountdown(5);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = loginUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, loginUrl]);

  const handleLogin = () => {
    window.location.href = loginUrl;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            Session Expired
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Your session has expired. Please log in again to continue.</p>
            <p className="text-sm text-muted-foreground">
              Redirecting to login in <span className="font-bold text-foreground">{countdown}</span> seconds...
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={handleLogin} className="w-full sm:w-auto">
            <LogIn className="w-4 h-4 mr-2" />
            Log In Now
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Event-based trigger for showing the dialog from non-React code
export const sessionExpiredEvent = new EventTarget();
export const SHOW_SESSION_EXPIRED = 'show-session-expired';

export const triggerSessionExpired = () => {
  sessionExpiredEvent.dispatchEvent(new Event(SHOW_SESSION_EXPIRED));
};

export default SessionExpiredDialog;
