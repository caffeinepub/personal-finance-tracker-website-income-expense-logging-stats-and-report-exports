import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export default function SignInScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background">
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'url(/assets/generated/finance-pattern.dim_1600x900.png)',
          backgroundSize: '800px 450px',
          backgroundRepeat: 'repeat'
        }}
      />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/assets/generated/finance-logo.dim_512x512.png" 
              alt="Finance Tracker"
              className="h-24 w-24"
            />
          </div>
          
          {/* Title */}
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">
            Finance Tracker
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Track your income and expenses with ease
          </p>
          
          {/* Sign in button */}
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="w-full"
          >
            {isLoggingIn ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Signing in...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-5 w-5" />
                Sign in to get started
              </>
            )}
          </Button>
          
          <p className="mt-6 text-sm text-muted-foreground">
            Secure authentication powered by Internet Identity
          </p>
        </div>
      </div>
    </div>
  );
}
