import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCallerUserProfile';
import SignInScreen from './features/auth/SignInScreen';
import ProfileSetupDialog from './features/auth/ProfileSetupDialog';
import AppShell from './components/layout/AppShell';
import TransactionsPage from './features/transactions/TransactionsPage';
import DashboardPage from './features/dashboard/DashboardPage';
import ReportsPage from './features/reports/ReportsPage';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

type View = 'dashboard' | 'transactions' | 'reports';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const isAuthenticated = !!identity;

  // Show loading during initialization
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in screen if not authenticated
  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SignInScreen />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show profile setup if authenticated but no profile exists
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppShell currentView={currentView} onViewChange={setCurrentView}>
        {currentView === 'dashboard' && <DashboardPage />}
        {currentView === 'transactions' && <TransactionsPage />}
        {currentView === 'reports' && <ReportsPage />}
      </AppShell>
      
      {showProfileSetup && <ProfileSetupDialog />}
      <Toaster />
    </ThemeProvider>
  );
}
