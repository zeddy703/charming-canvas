import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiRequest from '@/utils/api';

type PaymentStatus = 'pending' | 'success' | 'failed' | 'timeout';

interface PaymentConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkoutId: string;
  shortcode: string;
  timestamp: string;
  onSuccess?: () => void;
  onFailure?: (message: string) => void;
}

interface TransactionStatusResponse {
  success: boolean;
  status?: 'pending' | 'completed' | 'failed';
  message?: string;
  resultCode?: string;
}

const PaymentConfirmationDialog = ({
  open,
  onOpenChange,
  checkoutId,
  shortcode,
  timestamp,
  onSuccess,
  onFailure,
}: PaymentConfirmationDialogProps) => {
  const [status, setStatus] = useState<PaymentStatus>('pending');
  const [message, setMessage] = useState('');
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const attemptCountRef = useRef(0);
  const MAX_ATTEMPTS = 24; // 2 minutes max (24 * 5 seconds)

  useEffect(() => {
    if (!open || !checkoutId) return;

    // Reset state when dialog opens
    setStatus('pending');
    setMessage('');
    attemptCountRef.current = 0;

    const checkTransactionStatus = async () => {
      attemptCountRef.current += 1;

      try {
        const res = await apiRequest<TransactionStatusResponse>(
          '/api/payments/transaction/status',
          {
            method: 'POST',
            body: {
              checkoutId,
              shortcode,
              timestamp,
            },
          }
        );

        if (res.success && res.status === 'completed') {
          setStatus('success');
          setMessage(res.message || 'Payment completed successfully!');
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          onSuccess?.();
          return;
        }

        if (res.status === 'failed') {
          setStatus('failed');
          setMessage(res.message || 'Payment failed. Please try again.');
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          onFailure?.(res.message || 'Payment failed');
          return;
        }

        // Check if we've exceeded max attempts
        if (attemptCountRef.current >= MAX_ATTEMPTS) {
          setStatus('timeout');
          setMessage('Payment verification timed out. Please check your transaction history.');
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          return;
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
        // Don't stop polling on network errors, just continue
        if (attemptCountRef.current >= MAX_ATTEMPTS) {
          setStatus('timeout');
          setMessage('Unable to verify payment status. Please check your transaction history.');
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      }
    };

    // Start initial check
    checkTransactionStatus();

    // Start polling every 5 seconds
    pollingRef.current = setInterval(checkTransactionStatus, 5000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [open, checkoutId, shortcode, timestamp, onSuccess, onFailure]);

  const handleClose = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={status !== 'pending' ? onOpenChange : undefined}>
      <DialogContent 
        className="sm:max-w-md" 
        onInteractOutside={(e) => status === 'pending' && e.preventDefault()}
        onEscapeKeyDown={(e) => status === 'pending' && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            {status === 'pending' && 'Payment Confirmation'}
            {status === 'success' && 'Payment Successful'}
            {status === 'failed' && 'Payment Failed'}
            {status === 'timeout' && 'Verification Timeout'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6 space-y-4">
          {status === 'pending' && (
            <>
              <div className="text-center space-y-3">
                <p className="text-foreground font-medium">
                  Your payment confirmation has been sent.
                </p>
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Please do not close or refresh this page
                </p>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Waiting for confirmation from Safaricom...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-center text-foreground font-medium">{message}</p>
              <Button onClick={handleClose} className="mt-4">
                Close
              </Button>
            </>
          )}

          {status === 'failed' && (
            <>
              <XCircle className="h-16 w-16 text-destructive" />
              <p className="text-center text-foreground font-medium">{message}</p>
              <Button onClick={handleClose} variant="outline" className="mt-4">
                Close
              </Button>
            </>
          )}

          {status === 'timeout' && (
            <>
              <AlertTriangle className="h-16 w-16 text-amber-500" />
              <p className="text-center text-foreground font-medium">{message}</p>
              <Button onClick={handleClose} variant="outline" className="mt-4">
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
