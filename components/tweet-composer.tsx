'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createTweet } from '@/app/actions/tweets';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authClient } from '@/lib/auth/client';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TweetComposerProps {
  parentId?: string;
  placeholder?: string;
  className?: string;
}

export function TweetComposer({ parentId, placeholder = "Signal your perspective...", className }: TweetComposerProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [state, action, isPending] = useActionState(createTweet, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      toast.success(parentId ? 'Communication sent.' : 'Broadcast successful.');
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, parentId, router]);

  if (!session?.user) return null;

  return (
    <div className={cn("flex flex-col gap-6 p-8 border-b border-border bg-background", className)}>
      <div className="flex gap-6">
        <Avatar className="rounded-none h-14 w-14 border border-border grayscale hover:grayscale-0 transition-all duration-700">
          <AvatarImage src={session.user.image || ''} alt={session.user.name} className="object-cover" />
          <AvatarFallback className="rounded-none">{session.user.name[0]}</AvatarFallback>
        </Avatar>
        
        <form ref={formRef} action={action} className="flex-1 flex flex-col gap-6">
          {parentId && <input type="hidden" name="parentId" value={parentId} />}
          <Textarea 
            name="content"
            id={!parentId ? "main-tweet-composer" : undefined}
            placeholder={placeholder} 
            className="min-h-[120px] resize-none border-none focus-visible:ring-0 p-0 text-2xl font-body tracking-tight leading-relaxed placeholder:text-muted-foreground/30 placeholder:italic"
          />
          <div className="flex items-center justify-between border-t border-border/50 pt-6">
            <div className="flex gap-2">
               {/* Optional attachment icons could go here in future */}
            </div>
            <Button 
              type="submit" 
              disabled={isPending} 
              className="rounded-none bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground px-10 h-14 uppercase text-xs font-bold tracking-[0.3em] transition-all transform active:scale-95 shadow-none border-0"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {parentId ? 'Respond' : 'Broadcast'}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

