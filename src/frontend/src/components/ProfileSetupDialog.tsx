import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useUserProfile';
import { useCreateUserAccount } from '../hooks/useUserAccount';
import { SubscriptionTier } from '../backend';

export default function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const saveProfile = useSaveCallerUserProfile();
  const createAccount = useCreateUserAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        username: username.trim(),
        tier: SubscriptionTier.free,
      });
      await createAccount.mutateAsync(username.trim());
    } catch (error) {
      console.error('Profile setup error:', error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to AI Video Maker!</DialogTitle>
          <DialogDescription>Please set up your profile to get started.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!name.trim() || !username.trim() || saveProfile.isPending || createAccount.isPending}
          >
            {saveProfile.isPending || createAccount.isPending ? 'Setting up...' : 'Get Started'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
