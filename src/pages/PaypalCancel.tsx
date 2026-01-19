import { XCircle, ArrowLeft, Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PaypalCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const transactionRef = searchParams.get("receipt") || searchParams.get("paymentId") || searchParams.get("ref");

  const copyToClipboard = () => {
    if (transactionRef) {
      navigator.clipboard.writeText(transactionRef);
      toast({
        title: "Copied!",
        description: "Transaction reference copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center relative">
        <CardHeader className="pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/payments")}
            className="absolute left-4 top-4 gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Payment Cancelled</CardTitle>
          <CardDescription className="text-base">
            Your PayPal payment was not completed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {transactionRef && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">Transaction Reference</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-sm font-mono font-medium break-all">{transactionRef}</code>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={copyToClipboard}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
          <p className="text-muted-foreground">
            No charges have been made to your account. You can try again or choose a different payment method.
          </p>
          <Button onClick={() => navigate("/payments")} className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaypalCancel;
