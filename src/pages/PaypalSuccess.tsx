import { CheckCircle, ArrowLeft, Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PaypalSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const transactionRef = searchParams.get("token") || searchParams.get("paymentId") || searchParams.get("ref");

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
      <Card className="w-full max-w-md text-center">
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          <CardDescription className="text-base">
            Your PayPal payment has been processed successfully.
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
            Thank you for your payment. You will receive a confirmation email shortly.
          </p>
          <Button onClick={() => navigate("/payments")} className="w-full">
            Okay
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaypalSuccess;
