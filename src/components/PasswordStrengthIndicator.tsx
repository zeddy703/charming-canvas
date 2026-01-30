import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface StrengthResult {
  score: number;
  label: 'Weak' | 'Medium' | 'Strong';
  color: string;
}

const calculateStrength = (password: string): StrengthResult => {
  if (!password) {
    return { score: 0, label: 'Weak', color: 'bg-destructive' };
  }

  let score = 0;

  // Length checks
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Determine strength level
  if (score <= 2) {
    return { score: 33, label: 'Weak', color: 'bg-destructive' };
  } else if (score <= 4) {
    return { score: 66, label: 'Medium', color: 'bg-yellow-500' };
  } else {
    return { score: 100, label: 'Strong', color: 'bg-green-500' };
  }
};

const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const strength = useMemo(() => calculateStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Password strength</span>
        <span
          className={`font-medium ${
            strength.label === 'Weak'
              ? 'text-destructive'
              : strength.label === 'Medium'
              ? 'text-yellow-600'
              : 'text-green-600'
          }`}
        >
          {strength.label}
        </span>
      </div>
      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${strength.score}%` }}
        />
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
