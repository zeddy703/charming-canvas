import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiRequest from '@/utils/api';

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
}

type DialogState = 'loading' | 'success' | 'error';

const PaymentConfirmationDialog = ({
  open,
  onOpenChange,
  checkoutId,
  onSuccess,
  onFailure,
}: PaymentConfirmationDialogProps) => {
  const [dialogState, setDialogState] = useState<DialogState>('loading');
  const [responseMessage, setResponseMessage] = useState<string>('');
  const isMountedRef = useRef<boolean>(true);
  const hasRequestedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!open || !checkoutId) {
      return;
    }

    // Reset state when dialog opens
    setDialogState('loading');
    setResponseMessage('');
    hasRequestedRef.current = false;
    isMountedRef.current = true;

    const sendStatusRequest = async () => {
      if (hasRequestedRef.current) return;
      hasRequestedRef.current = true;

      try {
        const res = await apiRequest<TransactionStatusResponse>(
          `/api/initiate/payments/transaction/status/${checkoutId}`,
          { method: 'GET' }
        );

        if (!isMountedRef.current) return;

        if (res.success && res.status === 'completed') {
          setDialogState('success');
          setResponseMessage(res.message || 'Payment completed successfully!');
        } else if (res.status === 'failed' || !res.success) {
          setDialogState('error');
          setResponseMessage(res.message || 'Payment failed. Please try again.');
        } else {
          // Pending or other status - keep loading
          setResponseMessage(res.message || 'Payment is being processed...');
        }
      } catch (error) {
        console.error('Payment status request failed:', error);
        if (isMountedRef.current) {
          setDialogState('error');
          setResponseMessage('Failed to check payment status. Please try again.');
        }
      }
    };

    sendStatusRequest();

    return () => {
      isMountedRef.current = false;
    };
  }, [open, checkoutId]);

  const handleClose = () => {
    if (dialogState === 'success') {
      onSuccess?.();
    } else if (dialogState === 'error') {
      onFailure?.(responseMessage);
    }
    onOpenChange(false);
  };

  const canClose = dialogState === 'success' || dialogState === 'error';

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && canClose) {
          handleClose();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => {
          if (!canClose) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!canClose) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            {dialogState === 'loading' && 'Payment Confirmation Sent'}
            {dialogState === 'success' && 'Payment Successful'}
            {dialogState === 'error' && 'Payment Failed'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6 space-y-6">
          {dialogState === 'loading' && (
            <>
              <p className="text-sm text-muted-foreground text-center">
                Your payment confirmation has been sent to your phone.
              </p>
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  Please do not close or refresh this page
                </p>
              </div>
            </>
          )}

          {dialogState === 'success' && (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-500" />
              <p className="text-sm text-center text-muted-foreground">
                {responseMessage}
              </p>
              <Button onClick={handleClose} className="w-full">
                Done
              </Button>
            </>
          )}

          {dialogState === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-destructive" />
              <p className="text-sm text-center text-muted-foreground">
                {responseMessage}
              </p>
              <Button onClick={handleClose} variant="outline" className="w-full">
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