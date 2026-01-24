import { useState, useEffect } from 'react';
import { z } from 'zod';
import apiRequest from '@/utils/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EventRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: number;
    degree: string;
    name: string;
    date: string;
    time: string;
    isFree?: boolean;
    price?: number;
  };
}

// Form validation schema
const registrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens and apostrophes'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  memberNumber: z
    .string()
    .trim()
    .min(1, 'Member number is required')
    .max(20, 'Member number must be less than 20 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'Member number can only contain letters, numbers and hyphens'),
  valley: z.string().min(1, 'Please select a valley'),
});

type FormData = z.infer<typeof registrationSchema>;

interface FieldErrors {
  fullName?: string;
  email?: string;
  memberNumber?: string;
  valley?: string;
}

interface RegistrationResponse {
  success: boolean;
  message?: string;
  data?: {
    registrationId: string;
    requiresPayment: boolean;
    amount?: number;
    currency?: string;
  };
}

interface PaymentResponse {
  success: boolean;
  message?: string;
  data?: {
    transactionId: string;
    status: string;
  };
}

const valleys = [
  'Valley of Nairobi',
  'Valley of Mombasa',
  'Valley of Kisumu',
  'Valley of Nakuru',
  'Valley of Eldoret',
  'Valley of Nyeri',
  'Valley of Machakos',
];

const paymentMethods = [
  {
    id: 'creditcard',
    name: 'Credit Card',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png',
  },
  {
    id: 'mpesa',
    name: 'M-Pesa',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/200px-M-PESA_LOGO-01.svg.png',
  },
  {
    id: 'airtel',
    name: 'Airtel Money',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Airtel_logo.svg/200px-Airtel_logo.svg.png',
  },
];

type DialogStep = 'form' | 'submitting' | 'payment' | 'processing-payment' | 'success' | 'error';

const EventRegistrationDialog = ({ isOpen, onClose, event }: EventRegistrationDialogProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<DialogStep>('form');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [valley, setValley] = useState('');

  // Agreement checkboxes
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeCode, setAgreeCode] = useState(false);

  // Registration response data
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  // Payment
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [mobilePhoneNumber, setMobilePhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [loadingRate, setLoadingRate] = useState(false);

  // Errors
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [agreementError, setAgreementError] = useState('');

  const isFreeEvent = event.isFree ?? true;
  const eventPrice = event.price ?? 0;

  // Calculate display amount based on selected payment method
  const isMobilePayment = selectedPaymentMethod === 'mpesa' || selectedPaymentMethod === 'airtel';
  const displayAmount = isMobilePayment ? eventPrice * exchangeRate : eventPrice;
  const currencySymbol = isMobilePayment ? 'KSH ' : '$';

  // Fetch exchange rate when dialog opens
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (!isOpen || isFreeEvent) return;
      
      setLoadingRate(true);
      try {
        const response = await apiRequest<{ success: boolean; data: { rate: number } }>(
          '/api/initiate/payments/exchange-rate',
          { method: 'GET', showErrorToast: false }
        );
        if (response?.success) {
          setExchangeRate(response.data.rate);
        }
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        // Use fallback rate if API fails
        setExchangeRate(130);
      } finally {
        setLoadingRate(false);
      }
    };

    fetchExchangeRate();
  }, [isOpen, isFreeEvent]);

  // Sanitize input to prevent XSS
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  };

  const validateForm = (): boolean => {
    const formData: FormData = {
      fullName: sanitizeInput(fullName),
      email: sanitizeInput(email),
      memberNumber: sanitizeInput(memberNumber),
      valley,
    };

    const result = registrationSchema.safeParse(formData);
    
    if (!result.success) {
      const errors: FieldErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FieldErrors;
        errors[field] = err.message;
      });
      setFieldErrors(errors);
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const validateAgreements = (): boolean => {
    if (!agreeTerms || !agreePrivacy || !agreeCode) {
      setAgreementError('You must agree to all policies to continue');
      return false;
    }
    setAgreementError('');
    return true;
  };

  // Step 1: Submit form data to backend
  const handleFormSubmit = async () => {
    if (!validateForm()) return;
    if (!validateAgreements()) return;

    setStep('submitting');
    setErrorMessage('');

    try {
      const payload = {
        eventId: event.id,
        fullName: sanitizeInput(fullName),
        email: sanitizeInput(email),
        memberNumber: sanitizeInput(memberNumber),
        valley,
        isFree: isFreeEvent,
        price: isFreeEvent ? 0 : eventPrice,
      };

      const response = await apiRequest<RegistrationResponse>(
        '/api/events/register',
        {
          method: 'POST',
          body: payload,
        }
      );

      if (response.success) {
        setRegistrationId(response.data?.registrationId || null);
        
        if (response.data?.requiresPayment) {
          // Payment is required, show payment step
          setStep('payment');
        } else {
          // Free event or no payment required, show success
          setStep('success');
          toast({
            title: 'Registration Successful',
            description: `You have been registered for ${event.name}`,
          });
        }
      } else {
        setErrorMessage(response.message || 'Registration failed. Please try again.');
        setStep('error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('An error occurred during registration. Please try again.');
      setStep('error');
    }
  };

  const handlePaymentSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setMobilePhoneNumber('');
    setPhoneError('');
  };

  const validatePhoneNumber = (): boolean => {
    if (selectedPaymentMethod === 'mpesa' || selectedPaymentMethod === 'airtel') {
      const cleanPhone = mobilePhoneNumber.replace(/\s/g, '');
      // Validate Kenyan phone number format
      const phoneRegex = /^(?:\+254|254|0)?[17]\d{8}$/;
      if (!cleanPhone) {
        setPhoneError(`Please enter your ${selectedPaymentMethod === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} phone number`);
        return false;
      }
      if (!phoneRegex.test(cleanPhone)) {
        setPhoneError('Please enter a valid Kenyan phone number');
        return false;
      }
    }
    setPhoneError('');
    return true;
  };

  // Step 2: Submit payment to backend
  const handlePaymentSubmit = async () => {
    if (!selectedPaymentMethod) {
      toast({
        title: 'Payment Required',
        description: 'Please select a payment method',
        variant: 'destructive',
      });
      return;
    }

    if (!validatePhoneNumber()) {
      return;
    }

    setStep('processing-payment');
    setErrorMessage('');

    try {
<<<<<<< HEAD
      // Simulate API call
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
=======
      const paymentPayload = {
        registrationId,
        eventId: event.id,
        paymentMethod: selectedPaymentMethod,
        amount: displayAmount,
        currency: isMobilePayment ? 'KES' : 'USD',
        ...(isMobilePayment && { phoneNumber: mobilePhoneNumber.replace(/\s/g, '') }),
      };
>>>>>>> 4731ee03bcfe1700d0ac8a46e0f029506b6cf305

      const response = await apiRequest<PaymentResponse>(
        '/api/events/payment',
        {
          method: 'POST',
          body: paymentPayload,
        }
      );

      if (response.success) {
        setStep('success');
        toast({
          title: 'Payment Successful',
          description: `Your registration for ${event.name} is complete`,
        });
      } else {
        setErrorMessage(response.message || 'Payment failed. Please try again.');
        setStep('error');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('An error occurred during payment. Please try again.');
      setStep('error');
    }
  };

  const handleRetry = () => {
    if (registrationId) {
      // If we have a registration ID, go back to payment
      setStep('payment');
    } else {
      // Otherwise, go back to form
      setStep('form');
    }
    setErrorMessage('');
  };

  const handleClose = () => {
    // Reset form state
    setStep('form');
    setFullName('');
    setEmail('');
    setMemberNumber('');
    setValley('');
    setAgreeTerms(false);
    setAgreePrivacy(false);
    setAgreeCode(false);
    setMobilePhoneNumber('');
    setPhoneError('');
    setSelectedPaymentMethod(null);
    setFieldErrors({});
    setAgreementError('');
    setRegistrationId(null);
    setErrorMessage('');
    onClose();
  };

  const getDialogTitle = () => {
    switch (step) {
      case 'success':
        return 'Registration Complete';
      case 'error':
        return 'Registration Failed';
      default:
        return `Register for ${event.degree} - ${event.name}`;
    }
  };

  const getDialogDescription = () => {
    switch (step) {
      case 'form':
        return 'Fill in your details to register for this presentation';
      case 'submitting':
        return 'Submitting your registration...';
      case 'payment':
        return 'Select your preferred payment method';
      case 'processing-payment':
        return 'Processing your payment...';
      case 'success':
        return "You're all set!";
      case 'error':
        return 'Something went wrong';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        {step === 'form' && (
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className={fieldErrors.fullName ? 'border-destructive' : ''}
              />
              {fieldErrors.fullName && (
                <p className="text-sm text-destructive">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={fieldErrors.email ? 'border-destructive' : ''}
              />
              {fieldErrors.email && (
                <p className="text-sm text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            {/* Member Number */}
            <div className="space-y-2">
              <Label htmlFor="memberNumber">Member Number <span className="text-destructive">*</span></Label>
              <Input
                id="memberNumber"
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value)}
                placeholder="Enter your member number"
                className={fieldErrors.memberNumber ? 'border-destructive' : ''}
              />
              {fieldErrors.memberNumber && (
                <p className="text-sm text-destructive">{fieldErrors.memberNumber}</p>
              )}
            </div>

            {/* Valley */}
            <div className="space-y-2">
              <Label htmlFor="valley">Valley <span className="text-destructive">*</span></Label>
              <Select value={valley} onValueChange={setValley}>
                <SelectTrigger className={fieldErrors.valley ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select your valley" />
                </SelectTrigger>
                <SelectContent>
                  {valleys.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.valley && (
                <p className="text-sm text-destructive">{fieldErrors.valley}</p>
              )}
            </div>

            {/* Agreements */}
            <div className="space-y-3 pt-2 border-t">
              <p className="text-sm font-medium text-foreground">Agreements & Policies</p>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
                  I agree to the <span className="text-primary underline">Terms and Conditions</span>
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="privacy"
                  checked={agreePrivacy}
                  onCheckedChange={(checked) => setAgreePrivacy(checked === true)}
                />
                <Label htmlFor="privacy" className="text-sm leading-tight cursor-pointer">
                  I agree to the <span className="text-primary underline">Privacy Policy</span>
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="code"
                  checked={agreeCode}
                  onCheckedChange={(checked) => setAgreeCode(checked === true)}
                />
                <Label htmlFor="code" className="text-sm leading-tight cursor-pointer">
                  I agree to abide by the <span className="text-primary underline">Code of Conduct</span>
                </Label>
              </div>

              {agreementError && (
                <p className="text-sm text-destructive">{agreementError}</p>
              )}
            </div>

            {/* Event Info */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Event Date:</span>
                <span className="font-medium">{event.date}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Event Time:</span>
                <span className="font-medium">{event.time}</span>
              </div>
              {!isFreeEvent && (
                <div className="flex justify-between text-sm mt-1 pt-1 border-t">
                  <span className="text-muted-foreground">Registration Fee:</span>
                  <span className="font-bold text-primary">${eventPrice.toFixed(2)}</span>
                </div>
              )}
              {isFreeEvent && (
                <div className="flex justify-between text-sm mt-1 pt-1 border-t">
                  <span className="text-muted-foreground">Registration Fee:</span>
                  <span className="font-bold text-green-600">Free</span>
                </div>
              )}
            </div>

            <Button onClick={handleFormSubmit} className="w-full">
              {isFreeEvent ? 'Complete Registration' : 'Continue to Payment'}
            </Button>
          </div>
        )}

        {step === 'submitting' && (
          <div className="py-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-foreground font-medium">Submitting your registration...</p>
            <p className="text-sm text-muted-foreground mt-1">Please do not close this window</p>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select a payment method to complete your registration
            </p>

            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handlePaymentSelect(method.id)}
                  className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all hover:border-primary ${
                    selectedPaymentMethod === method.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border'
                  }`}
                >
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="h-8 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <CreditCard className="h-8 w-8 text-muted-foreground hidden" />
                  <span className="text-sm font-medium">{method.name}</span>
                </button>
              ))}
            </div>

            {/* Phone Number Input for M-Pesa/Airtel */}
            {(selectedPaymentMethod === 'mpesa' || selectedPaymentMethod === 'airtel') && (
              <div className="space-y-2">
                <Label htmlFor="mobilePhone">
                  {selectedPaymentMethod === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} Phone Number{' '}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mobilePhone"
                  type="tel"
                  value={mobilePhoneNumber}
                  onChange={(e) => setMobilePhoneNumber(e.target.value)}
                  placeholder={selectedPaymentMethod === 'mpesa' ? 'e.g., 0712345678' : 'e.g., 0733123456'}
                  className={phoneError ? 'border-destructive' : ''}
                />
                {phoneError && (
                  <p className="text-sm text-destructive">{phoneError}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enter the phone number registered with your {selectedPaymentMethod === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} account
                </p>
              </div>
            )}

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount to Pay:</span>
                <div className="text-right">
                  {loadingRate && isMobilePayment ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <>
                      <span className="font-bold text-lg">
                        {currencySymbol}{displayAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      {isMobilePayment && (
                        <p className="text-xs text-muted-foreground">
                          (${eventPrice.toFixed(2)} × {exchangeRate.toFixed(2)})
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('form')} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handlePaymentSubmit}
                disabled={!selectedPaymentMethod || ((selectedPaymentMethod === 'mpesa' || selectedPaymentMethod === 'airtel') && !mobilePhoneNumber)}
                className="flex-1"
              >
                Pay Now
              </Button>
            </div>
          </div>
        )}

        {step === 'processing-payment' && (
          <div className="py-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-foreground font-medium">Processing your payment...</p>
            <p className="text-sm text-muted-foreground mt-1">Please do not close this window</p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-foreground font-medium text-lg">You're Registered!</p>
            <p className="text-sm text-muted-foreground mt-1">
              A confirmation email has been sent to {email}
            </p>
            <Button onClick={handleClose} className="mt-6">
              Close
            </Button>
          </div>
        )}

        {step === 'error' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <p className="text-foreground font-medium text-lg">Registration Failed</p>
            <p className="text-sm text-muted-foreground mt-1">
              {errorMessage}
            </p>
            <div className="flex gap-3 mt-6 justify-center">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleRetry}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationDialog;
