import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiRequest from '@/utils/api';
import { z } from 'zod';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface PaypalPaymentOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  methodId: string;
}

type Step = 'loading-profile' | 'confirm-info' | 'processing-payment' | 'error';

// Zod validation schema
const paypalFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^\+?[0-9\s\-()]{7,20}$/.test(val),
      'Please enter a valid phone number (7-20 digits, may include +, spaces, hyphens, or parentheses)'
    ),
});

type PaypalFormData = z.infer<typeof paypalFormSchema>;

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

const PaypalPaymentOverlay = ({
  isOpen,
  onClose,
  amount,
  methodId,
}: PaypalPaymentOverlayProps) => {
  const [step, setStep] = useState<Step>('loading-profile');
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const fetchUserProfile = async () => {
    setStep('loading-profile');
    setError('');
    setFieldErrors({});
    
    try {
      const res = await apiRequest<{ success: boolean; data: UserProfile }>(
        '/api/user/account/profile/info',
        { method: 'GET', showErrorToast: false }
      );

      if (res?.success && res?.data) {
        setFirstName(res.data.firstName || '');
        setLastName(res.data.lastName || '');
        setEmail(res.data.email || '');
        setPhone(res.data.phone || '');
      }
      
      setStep('confirm-info');
    } catch (err: any) {
      setError(err?.message || 'Failed to load your profile. Please try again.');
      setStep('error');
    }
  };

  const validateForm = (): PaypalFormData | null => {
    setFieldErrors({});
    setError('');

    const result = paypalFormSchema.safeParse({
      firstName,
      lastName,
      email,
      phone: phone || undefined,
    });

    if (!result.success) {
      const errors: FieldErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FieldErrors;
        if (!errors[field]) {
          errors[field] = err.message;
        }
      });
      setFieldErrors(errors);
      return null;
    }

    return result.data;
  };

  const handleProceed = async () => {
    const validatedData = validateForm();
    if (!validatedData) {
      return;
    }

    setStep('processing-payment');
    setError('');

    try {
      const payload = {
        methodId,
        amount,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      };

      const res = await apiRequest<{ 
        success: boolean; 
        url?: string;
        message?: string;
      }>(
        '/api/initiate/payment/services',
        {
          method: 'POST',
          body: payload,
          showErrorToast: false,
        }
      );

      if (res?.success && res?.url) {
        // Redirect to PayPal
        window.location.href = res.url;
      } else {
        throw new Error(res?.message || 'Failed to initiate PayPal payment.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to process payment. Please try again.');
      setStep('error');
    }
  };

  const handleClose = () => {
    // Reset state
    setStep('loading-profile');
    setError('');
    setFieldErrors({});
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-heading text-lg font-semibold">PayPal Payment</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          disabled={step === 'processing-payment'}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        {step === 'loading-profile' && (
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">Processing</p>
            <p className="text-muted-foreground mt-1">Loading your information...</p>
          </div>
        )}

        {step === 'confirm-info' && (
          <div className="w-full max-w-md">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  Confirm Your Information
                </h3>
                <p className="text-sm text-muted-foreground">
                  This information will be used to process your PayPal payment of{' '}
                  <span className="font-semibold text-foreground">${amount.toFixed(2)}</span>
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (fieldErrors.firstName) setFieldErrors(prev => ({ ...prev, firstName: undefined }));
                      }}
                      placeholder="Enter first name"
                      className={`mt-1.5 ${fieldErrors.firstName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {fieldErrors.firstName && (
                      <p className="text-xs text-destructive mt-1">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (fieldErrors.lastName) setFieldErrors(prev => ({ ...prev, lastName: undefined }));
                      }}
                      placeholder="Enter last name"
                      className={`mt-1.5 ${fieldErrors.lastName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {fieldErrors.lastName && (
                      <p className="text-xs text-destructive mt-1">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    placeholder="Enter your email"
                    className={`mt-1.5 ${fieldErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="Enter your phone number"
                    className={`mt-1.5 ${fieldErrors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-destructive mt-1">{fieldErrors.phone}</p>
                  )}
                </div>
              </div>

              <Button
                onClick={handleProceed}
                className="w-full mt-6"
              >
                Proceed to PayPal
              </Button>
            </div>
          </div>
        )}

        {step === 'processing-payment' && (
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">Redirecting to PayPal</p>
            <p className="text-muted-foreground mt-1">
              You will be redirected to PayPal to complete your payment...
            </p>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center w-full max-w-md">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={fetchUserProfile} variant="default">
                Try Again
              </Button>
              <Button onClick={handleClose} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaypalPaymentOverlay;
