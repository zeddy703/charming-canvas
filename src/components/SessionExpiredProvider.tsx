import { useState, useEffect } from 'react';
import SessionExpiredDialog, { 
  sessionExpiredEvent, 
  SHOW_SESSION_EXPIRED 
} from './SessionExpiredDialog';

interface SessionExpiredProviderProps {
  children: React.ReactNode;
  loginUrl?: string;
}

const SessionExpiredProvider = ({ 
  children, 
  loginUrl = '/login' 
}: SessionExpiredProviderProps) => {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const handleSessionExpired = () => {
      setShowDialog(true);
    };

    sessionExpiredEvent.addEventListener(SHOW_SESSION_EXPIRED, handleSessionExpired);
    
    return () => {
      sessionExpiredEvent.removeEventListener(SHOW_SESSION_EXPIRED, handleSessionExpired);
    };
  }, []);

  return (
    <>
      {children}
      <SessionExpiredDialog 
        open={showDialog} 
        onOpenChange={setShowDialog}
        loginUrl={loginUrl}
      />
    </>
  );
};

export default SessionExpiredProvider;
