'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createTweet } from '@/app/actions/tweets';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authClient } from '@/lib/auth/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TweetComposerProps {
  parentId?: string;
  placeholder?: string;
  className?: string;
}

export function TweetComposer({ parentId, placeholder = "What is happening?!", className }: TweetComposerProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [state, action, isPending] = useActionState(createTweet, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      toast.success(parentId ? 'Reply posted!' : 'Tweet posted!');
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, parentId, router]);

  if (!session?.user) return null;

  return (
    <div className={cn("flex gap-4 p-4 border-b", className)}>
      <Avatar>
        <AvatarImage src={session.user.image || ''} alt={session.user.name} />
        <AvatarFallback>{session.user.name[0]}</AvatarFallback>
      </Avatar>
      
      <form ref={formRef} action={action} className="flex-1 space-y-4">
        {parentId && <input type="hidden" name="parentId" value={parentId} />}
        <Textarea 
          name="content"
          placeholder={placeholder} 
          className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-xl placeholder:text-muted-foreground/50"
        />
        <div className="flex justify-end border-t pt-4">
          <Button type="submit" disabled={isPending} className="rounded-full font-bold">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {parentId ? 'Reply' : 'Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}






