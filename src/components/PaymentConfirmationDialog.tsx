import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';
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

const PaymentConfirmationDialog = ({
  open,
  onOpenChange,
  checkoutId,
  onSuccess,
  onFailure,
}: PaymentConfirmationDialogProps) => {
  const [hasSent, setHasSent] = useState(false);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    if (!open || !checkoutId) {
      return;
    }

    // Reset state when dialog opens
    setHasSent(false);
    isMountedRef.current = true;

    // Single API call - no polling
    const sendStatusRequest = async () => {
      if (hasSent) return;
      setHasSent(true);

      try {
        const res = await apiRequest<TransactionStatusResponse>(
          `/api/initiate/payments/transaction/status/${checkoutId}`,
          { method: 'GET' }
        );

        if (!isMountedRef.current) return;

        // Handle immediate completion
        if (res.success && res.status === 'completed') {
          onSuccess?.();
          onOpenChange(false);
          return;
        }

        // Handle immediate failure
        if (res.status === 'failed') {
          onFailure?.(res.message || 'Payment failed');
          onOpenChange(false);
          return;
        }

        // For pending or any other status, just keep showing the dialog
        // The dialog stays open with the "do not close" message
      } catch (error) {
        console.error('Payment status request failed:', error);
        // Keep showing the dialog even on error
      }
    };

    sendStatusRequest();

    return () => {
      isMountedRef.current = false;
    };
  }, [open, checkoutId]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        // Prevent closing - user must not close this dialog
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            Payment Confirmation Sent
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6 space-y-6">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentConfirmationDialog;