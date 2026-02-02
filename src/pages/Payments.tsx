import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  DollarSign, 
  FileText, 
  Smartphone, 
  Wallet,
  Loader2,
  Phone
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import apiRequest from '@/utils/api';
import PaymentConfirmationDialog from '@/components/PaymentConfirmationDialog';
import PaypalPaymentOverlay from '@/components/PaypalPaymentOverlay';
import { initiatePayment } from '@/utils/init';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: 'CreditCard' | 'Wallet' | 'Smartphone';
  currency: 'USD' | 'KES';
}

interface PaymentHistoryItem {
  id: string | number;
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface DuesStatus {
  year: number;
  amount: number;
  status: 'current' | 'overdue' | 'upcoming';
  dueDate: string;
  paidDate?: string;
}

const iconMap = {
  CreditCard,
  Wallet,
  Smartphone,
};

const Payments = () => {
  const { toast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Payment confirmation dialog state
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    checkoutId: '',
  });

  // PayPal overlay state
  const [isPaypalOverlayOpen, setIsPaypalOverlayOpen] = useState(false);

  // Data states
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [duesStatus, setDuesStatus] = useState<DuesStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [currency, setCurrency] = useState<string>('USD');

  // Get selected payment method and calculate display amount
  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);
  const baseAmount = duesStatus?.amount || 155.00;
  const isKES = selectedPaymentMethod?.currency === 'KES';
  const displayAmount = isKES ? baseAmount * exchangeRate : baseAmount;
  const currencySymbol = isKES ? 'KSH ' : '$';
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch payment methods
        const methodsRes = await apiRequest<{ success: boolean; data: PaymentMethod[]; rate: number; currency: string }>(
          '/api/initiate/payments/methods',
          { method: 'GET' }
        );

        if (methodsRes?.success) {
          setExchangeRate(methodsRes.rate);
          setCurrency(methodsRes.currency);
          setPaymentMethods(methodsRes.data);
          if (methodsRes.data.length > 0) {
            setSelectedMethod(methodsRes.data[0].id);
          }
        }

        // Fetch payment history
        const historyRes = await apiRequest<{ success: boolean; data: PaymentHistoryItem[] }>(
          '/api/initiate/payments/transactions/history',
          { method: 'GET' }
        );

        if (historyRes?.success) {
          setPaymentHistory(historyRes.data);
        }

        // Fetch current dues
        const duesRes = await apiRequest<{ success: boolean; data: DuesStatus }>(
          '/api/payments/dues/current',
          { method: 'GET' }
        );

        if (duesRes?.success) {
          setDuesStatus(duesRes.data);
        }

      } catch (err) {
        console.error('Failed to load payment data:', err);
        toast({
          title: 'Loading Failed',
          description: 'Could not load payment information.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleMakePayment = async () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (!method) return;

    // Handle PayPal separately with overlay flow
    if (method.id === 'paypal') {
      setIsPaymentOpen(false);
      setIsPaypalOverlayOpen(true);
      return;
    }

    const requiresPhone = method.id === 'mpesa' || method.id === 'airtelmoney';
    if (requiresPhone && !phoneNumber.trim()) {
      toast({
        title: 'Phone Number Required',
        description: 'Please enter your registered mobile money number.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {

         const data = {
         referenceType: "DUES", 
         referenceId: "D-3687-12", 
         paymentMethod: "paypal", 
         amount: 155, 
         currency: "USD", 
         firstName: null, 
         lastName: null, 
         email: null,
       }
      const initRes = await initiatePayment(data);

      if(!initRes?.success || !initRes?.data) {
         //setErrorMessage(initRes?.message || initRes?.error || 'Payment failed. Please try again.');
        //setStep('error');
        return;
      }

      const payload: any = {
        payId: initRes?.data?.paymentId,
        methodId: selectedMethod,
        phone:""
      };

      if (requiresPhone) {
        payload.phone = phoneNumber.trim();
      }

      const res = await apiRequest<{ 
        success: boolean; 
        checkoutId?: string;
      }>(
        '/api/initiate/payment/services',
        {
          method: 'POST',
          body: payload,
        }
      );

      if (res?.success && res?.checkoutId) {
        // Store payment details for polling
        setPaymentDetails({
          checkoutId: res.checkoutId,
        });
        
        // Close payment method dialog and open confirmation dialog
        setIsPaymentOpen(false);
        setPhoneNumber('');
        setIsConfirmationOpen(true);
      }
    } catch (err) {
      toast({
        title: 'Payment Failed',
        description: 'Could not start payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Refresh payment history after successful payment
    toast({
      title: 'Payment Successful',
      description: 'Your payment has been processed successfully.',
    });
    // Optionally refresh the page data
    window.location.reload();
  };

  const handlePaymentFailure = (message: string) => {
    toast({
      title: 'Payment Failed',
      description: message,
      variant: 'destructive',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

          <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {/* Header Skeleton */}
              <div className="mb-8">
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-5 w-72" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dues Status Skeleton */}
                <div className="progress-card">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-20 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                {/* Pay Now Skeleton */}
                <div className="lg:col-span-2 progress-card">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-7 w-20" />
                    </div>
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>

              {/* Accepted Methods Skeleton */}
              <div className="progress-card mt-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-4 bg-muted/30 rounded-lg">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment History Skeleton */}
              <div className="progress-card mt-6">
                <Skeleton className="h-6 w-36 mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-5 w-16 mb-1" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">My Payments</h1>
              <p className="text-muted-foreground">Manage your dues and financial transactions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dues Status */}
              <div className="progress-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold">Dues Status</h2>
                    <p className="text-sm text-muted-foreground">
                      {duesStatus?.year || 'Current'} Membership
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="text-primary" size={20} />
                  <span className="font-medium text-primary capitalize">
                    {duesStatus?.status || 'Current'}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  {duesStatus?.paidDate && <p>Paid: {duesStatus.paidDate}</p>}
                  <p>Next Due: {duesStatus?.dueDate || 'January 1, 2026'}</p>
                  <p className="font-semibold text-foreground">
                    Amount: ${duesStatus?.amount?.toFixed(2) || '155.00'}
                  </p>
                </div>
              </div>

              {/* Pay Now */}
              <div className="lg:col-span-2 progress-card">
                <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="text-primary" size={20} />
                  Pay Your Dues
                </h3>

                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">
                      {duesStatus?.year || '2026'} Annual Dues
                    </span>
                    <span className="font-heading text-xl font-bold">
                      ${duesStatus?.amount?.toFixed(2) || '155.00'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Due by {duesStatus?.dueDate || 'January 1, 2026'}
                  </p>
                </div>

                <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                  <DialogTrigger asChild>
                    <Button disabled={paymentMethods.length === 0}>
                      <CreditCard size={16} className="mr-2" />
                      Pay Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Select Payment Method</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                      <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                        {paymentMethods.map((method) => {
                          const Icon = iconMap[method.icon];
                          return (
                            <div
                              key={method.id}
                              className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all mb-3 ${
                                selectedMethod === method.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              onClick={() => setSelectedMethod(method.id)}
                            >
                              <RadioGroupItem value={method.id} id={method.id} />
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icon className="text-primary" size={20} />
                              </div>
                              <div className="flex-1">
                                <Label htmlFor={method.id} className="font-medium cursor-pointer">
                                  {method.name}
                                </Label>
                                <p className="text-sm text-muted-foreground">{method.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </RadioGroup>

                      {/* Phone Number for Mobile Money */}
                      {(selectedMethod === 'mpesa' || selectedMethod === 'airtel-money') && (
                        <div className="mt-4">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+254712345678"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      )}

                      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total Amount:</span>
                          <div className="text-right">
                            <span className="font-bold text-xl">
                              {currencySymbol}{displayAmount.toFixed(2)}
                            </span>
                            {isKES && (
                              <p className="text-xs text-muted-foreground">
                                (${baseAmount.toFixed(2)} × {exchangeRate.toFixed(2)})
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={handleMakePayment} 
                        className="w-full mt-4"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Complete Payment'
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Accepted Methods */}
            <div className="progress-card mt-6">
              <h3 className="font-heading text-lg font-semibold mb-4">Accepted Payment Methods</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = iconMap[method.icon];
                  return (
                    <div key={method.id} className="flex flex-col items-center gap-2 p-4 bg-muted/30 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="text-primary" size={24} />
                      </div>
                      <span className="text-sm font-medium text-center">{method.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment History */}
            <div className="progress-card mt-6">
              <h3 className="font-heading text-lg font-semibold mb-4">Payment History</h3>
              {paymentHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No payment history yet.</p>
              ) : (
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle className="text-primary" size={20} />
                        </div>
                        <div>
                          <p className="font-medium">{payment.description || 'No description'}</p>
                          <p className="text-sm text-muted-foreground">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${payment.amount.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          payment.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : payment.status === 'pending'
                             ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Payment Confirmation Dialog with Polling */}
      <PaymentConfirmationDialog
        open={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
        checkoutId={paymentDetails.checkoutId}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
      />

      {/* PayPal Payment Overlay */}
      <PaypalPaymentOverlay
        isOpen={isPaypalOverlayOpen}
        onClose={() => setIsPaypalOverlayOpen(false)}
        amount={duesStatus?.amount || 155.00}
        methodId="paypal"
      />
    </div>
  );
};

export default Payments;