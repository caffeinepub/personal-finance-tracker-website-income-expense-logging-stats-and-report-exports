import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface AccessDeniedScreenProps {
  message?: string;
  onRetry?: () => void;
}

export default function AccessDeniedScreen({ 
  message = 'You do not have permission to access this resource.',
  onRetry 
}: AccessDeniedScreenProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <h2 className="mb-2 text-2xl font-semibold">Access Denied</h2>
        <p className="mb-6 text-muted-foreground">{message}</p>
        {onRetry && (
          <Button onClick={onRetry}>Try Again</Button>
        )}
      </div>
    </div>
  );
}
