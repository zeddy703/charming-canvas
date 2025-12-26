import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { CreditCard, Calendar, CheckCircle, DollarSign, FileText, Smartphone, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const paymentHistory = [
  { id: 1, description: "Annual Dues 2024", amount: 150.00, date: "Jan 15, 2024", status: "paid" },
  { id: 2, description: "Annual Dues 2023", amount: 145.00, date: "Jan 12, 2023", status: "paid" },
  { id: 3, description: "Valley Event Fee", amount: 35.00, date: "Oct 5, 2023", status: "paid" },
  { id: 4, description: "Annual Dues 2022", amount: 140.00, date: "Jan 20, 2022", status: "paid" },
];

const paymentMethods = [
  {
    id: 'credit-card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, American Express',
    icon: CreditCard,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay securely with your PayPal account',
    icon: Wallet,
  },
  {
    id: 'mpesa',
    name: 'M-Pesa',
    description: 'Mobile money payment via M-Pesa',
    icon: Smartphone,
  },
  {
    id: 'airtel-money',
    name: 'Airtel Money',
    description: 'Mobile money payment via Airtel',
    icon: Smartphone,
  },
];

const Payments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('credit-card');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();

  const handlePayment = () => {
    if ((selectedMethod === 'mpesa' || selectedMethod === 'airtel-money') && !phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number for mobile money payment.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Payment Initiated",
      description: `Your payment via ${paymentMethods.find(m => m.id === selectedMethod)?.name} is being processed.`,
    });
    setIsPaymentOpen(false);
    setPhoneNumber('');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">My Payments</h1>
              <p className="text-muted-foreground">Manage your dues and financial transactions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dues Status Card */}
              <div className="progress-card animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold">Dues Status</h2>
                    <p className="text-sm text-muted-foreground">2024 Membership</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="text-primary" size={20} />
                  <span className="font-medium text-primary">Current</span>
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Paid: January 15, 2024</p>
                  <p>Next Due: January 1, 2025</p>
                </div>
              </div>

              {/* Quick Pay Card */}
              <div className="lg:col-span-2 progress-card animate-fade-in" style={{ animationDelay: '100ms' }}>
                <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="text-primary" size={20} />
                  Pay Your Dues
                </h3>
                
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">2025 Annual Dues</span>
                    <span className="font-heading text-xl font-bold">$155.00</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Due by January 1, 2025</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex-1 min-w-[150px]">
                        <CreditCard size={16} className="mr-2" />
                        Pay Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="font-heading">Select Payment Method</DialogTitle>
                      </DialogHeader>
                      
                      <div className="py-4">
                        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-3">
                          {paymentMethods.map((method) => {
                            const Icon = method.icon;
                            return (
                              <div 
                                key={method.id}
                                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
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

                        {/* Phone Number Input for Mobile Money */}
                        {(selectedMethod === 'mpesa' || selectedMethod === 'airtel-money') && (
                          <div className="mt-4 p-4 bg-muted/30 rounded-lg animate-fade-in">
                            <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="e.g., +254712345678"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="mt-2"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                              Enter the phone number registered with your {selectedMethod === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} account
                            </p>
                          </div>
                        )}

                        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Amount to Pay:</span>
                            <span className="font-heading text-xl font-bold text-primary">$155.00</span>
                          </div>
                        </div>

                        <Button onClick={handlePayment} className="w-full mt-4">
                          Complete Payment
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" className="flex-1 min-w-[150px]">
                    <Calendar size={16} className="mr-2" />
                    Set Up Auto-Pay
                  </Button>
                </div>
              </div>
            </div>

            {/* Payment Methods Info */}
            <div className="progress-card mt-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
              <h3 className="font-heading text-lg font-semibold mb-4">Accepted Payment Methods</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
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
            <div className="progress-card mt-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="text-primary" size={20} />
                Payment History
              </h3>
              
              <div className="space-y-3">
                {paymentHistory.map((payment) => (
                  <div 
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="text-primary" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{payment.description}</p>
                        <p className="text-sm text-muted-foreground">{payment.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-semibold text-foreground">${payment.amount.toFixed(2)}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        Paid
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4">
                View All Transactions
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payments;
