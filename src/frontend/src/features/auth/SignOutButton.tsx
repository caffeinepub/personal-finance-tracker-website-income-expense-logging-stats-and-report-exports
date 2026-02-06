import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      className="text-muted-foreground hover:text-foreground"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  );
}
