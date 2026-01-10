import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiRequest from '@/utils/api';

type PaymentStatus = 'initiating' | 'pending' | 'success' | 'failed' | 'error';

interface PaymentConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkoutId?: string;
  onSuccess?: () => void;
  onFailure?: (message: string) => void;
}

interface TransactionStatusResponse {
  success: boolean;
  status?: 'pending' | 'completed' | 'failed';
  message?: string;
  resultCode?: string;
  estimatedWaitTime?: number; // seconds
}

const PaymentConfirmationDialog = ({
  open,
  onOpenChange,
  checkoutId,
  onSuccess,
  onFailure,
}: PaymentConfirmationDialogProps) => {
  const [status, setStatus] = useState<PaymentStatus>('initiating');
  const [message, setMessage] = useState('');
  const [estimatedWait, setEstimatedWait] = useState<number>(120); // default 2 minutes
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);
  const hasCheckedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!open || !checkoutId) {
      return;
    }

    // Reset state
    setStatus('initiating');
    setMessage('');
    setSecondsElapsed(0);
    startTimeRef.current = Date.now();
    isMountedRef.current = true;
    hasCheckedRef.current = false;

    // Single API call to initiate backend polling
    const initiatePaymentCheck = async () => {
      if (hasCheckedRef.current) return;
      hasCheckedRef.current = true;

      try {
        const res = await apiRequest<TransactionStatusResponse>(
          `/api/initiate/payments/transaction/status/${checkoutId}`,
          { method: 'GET' }
        );

        if (!isMountedRef.current) return;

        // Handle immediate completion (rare but possible)
        if (res.success && res.status === 'completed') {
          setStatus('success');
          setMessage(res.message || 'Payment completed successfully!');
          onSuccess?.();
          return;
        }

        // Handle immediate failure
        if (res.status === 'failed') {
          setStatus('failed');
          setMessage(res.message || 'Payment failed. Please try again.');
          onFailure?.(res.message || 'Payment failed');
          return;
        }

        // Payment is pending - backend will poll
        setStatus('pending');
        setMessage('Backend is monitoring your payment. You can close this dialog.');
        
        if (res.estimatedWaitTime) {
          setEstimatedWait(res.estimatedWaitTime);
        }

      } catch (error) {
        console.error('Payment status check failed:', error);
        if (isMountedRef.current) {
          setStatus('error');
          setMessage('Failed to connect to server. Please try again or check your M-Pesa messages.');
        }
      }
    };

    // Start the single check
    initiatePaymentCheck();

    // Start elapsed time counter (for UX feedback)
    timerRef.current = setInterval(() => {
      if (isMountedRef.current) {
        setSecondsElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);

    // Cleanup
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [open, checkoutId, onSuccess, onFailure]);

  const handleClose = () => {
    // Allow closing in any state except initiating
    if (status === 'initiating') return;
    onOpenChange(false);
  };

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const estimatedMinutes = Math.ceil(estimatedWait / 60);

  return (
    <Dialog
      open={open}
      onOpenChange={(willOpen) => {
        // Prevent closing while initiating
        if (!willOpen && status === 'initiating') return;
        onOpenChange(willOpen);
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => status === 'initiating' && e.preventDefault()}
        onEscapeKeyDown={(e) => status === 'initiating' && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            {status === 'initiating' && 'Initiating Payment Check...'}
            {status === 'pending' && 'Payment Pending'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'failed' && 'Payment Failed'}
            {status === 'error' && 'Connection Error'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6 space-y-6">
          {status === 'initiating' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Connecting to payment server...
              </p>
            </>
          )}

          {status === 'pending' && (
            <>
              <Clock className="h-16 w-16 text-blue-500" />

              <div className="text-center space-y-3">
                <p className="font-medium text-lg">Payment is being processed</p>
                <p className="text-sm text-muted-foreground">
                  Our server is monitoring your M-Pesa transaction
                </p>
                <p className="text-sm text-muted-foreground">
                  Elapsed: {formatElapsedTime(secondsElapsed)}
                </p>
              </div>

              <div className="w-full space-y-3">
                <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <p className="font-medium">You can safely close this dialog</p>
                    <p className="text-xs">
                      Estimated wait: ~{estimatedMinutes} minute{estimatedMinutes !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-center space-y-1">
                  <p>✓ Backend is polling M-Pesa every few seconds</p>
                  <p>✓ You'll be notified when payment completes</p>
                  <p>✓ Check your M-Pesa messages for confirmation</p>
                </div>
              </div>

              <Button 
                onClick={handleClose} 
                variant="outline" 
                size="lg" 
                className="mt-2"
              >
                Close & Wait
              </Button>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-20 w-20 text-green-500" />
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">{message}</p>
                <p className="text-sm text-muted-foreground">
                  Completed in {formatElapsedTime(secondsElapsed)}
                </p>
              </div>
              <Button onClick={handleClose} size="lg" className="mt-4">
                Done
              </Button>
            </>
          )}

          {status === 'failed' && (
            <>
              <XCircle className="h-20 w-20 text-destructive" />
              <p className="text-lg font-medium text-center">{message}</p>
              <div className="text-sm text-muted-foreground text-center mt-2">
                <p>Please check your M-Pesa balance and try again</p>
              </div>
              <Button onClick={handleClose} variant="outline" size="lg" className="mt-4">
                Close
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertTriangle className="h-20 w-20 text-amber-500" />
              <p className="text-lg font-medium text-center text-balance px-4">
                {message}
              </p>
              <div className="text-sm text-muted-foreground text-center space-y-1">
                <p>Your payment may still be processing</p>
                <p>Please check your M-Pesa messages</p>
              </div>
              <Button onClick={handleClose} variant="outline" size="lg" className="mt-4">
                Close
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentConfirmationDialog;