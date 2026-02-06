import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Receipt, FileText } from 'lucide-react';
import SignOutButton from '../../features/auth/SignOutButton';
import { useGetCallerUserProfile } from '../../hooks/useCallerUserProfile';

type View = 'dashboard' | 'transactions' | 'reports';

interface AppShellProps {
  children: ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function AppShell({ children, currentView, onViewChange }: AppShellProps) {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background pattern */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/finance-pattern.dim_1600x900.png)',
          backgroundSize: '800px 450px',
          backgroundRepeat: 'repeat'
        }}
      />
      
      {/* Header */}
      <header className="relative border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/finance-logo.dim_512x512.png" 
              alt="Finance Tracker"
              className="h-8 w-8"
            />
            <h1 className="text-xl font-bold">Finance Tracker</h1>
          </div>
          
          <nav className="flex items-center gap-2">
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('dashboard')}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={currentView === 'transactions' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('transactions')}
            >
              <Receipt className="mr-2 h-4 w-4" />
              Transactions
            </Button>
            <Button
              variant={currentView === 'reports' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('reports')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </nav>
          
          <div className="flex items-center gap-4">
            {userProfile && (
              <span className="text-sm text-muted-foreground">
                {userProfile.name}
              </span>
            )}
            <SignOutButton />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="relative container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="relative border-t py-6 text-center text-sm text-muted-foreground">
        © 2026. Built with ❤️ using{' '}
        <a 
          href="https://caffeine.ai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
