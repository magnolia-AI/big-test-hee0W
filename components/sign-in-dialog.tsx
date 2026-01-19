
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Sign in to join the conversation</DialogTitle>
          <DialogDescription className="text-center">
            You need to be signed in to like, reply, and repost tweets.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button asChild className="w-full rounded-full font-bold" size="lg">
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-full font-bold" size="lg">
            <Link href="/auth/sign-up">Create account</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

