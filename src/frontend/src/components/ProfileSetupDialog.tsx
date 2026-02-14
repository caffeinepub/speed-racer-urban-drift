import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveProfile(
        { name: name.trim(), displayName: name.trim() },
        {
          onSuccess: () => {
            toast.success('Profile created!');
          },
          onError: () => {
            toast.error('Failed to create profile');
          }
        }
      );
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md bg-black/95 border-neon-cyan/50">
        <DialogHeader>
          <DialogTitle className="text-2xl neon-text">Welcome, Racer!</DialogTitle>
          <DialogDescription>
            Enter your name to get started and track your progress on the leaderboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your racer name"
              className="border-neon-cyan/50"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            disabled={!name.trim() || isPending}
            className="w-full neon-button"
          >
            {isPending ? 'Creating Profile...' : 'Start Racing'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
