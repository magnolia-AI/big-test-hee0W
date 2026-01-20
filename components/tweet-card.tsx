'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TweetWithAuthor, toggleLike } from '@/app/actions/tweets';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useOptimistic, startTransition, useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth/client';
import { SignInDialog } from '@/components/sign-in-dialog';

import { useRouter } from 'next/navigation';

interface TweetCardProps {
  tweet: TweetWithAuthor;
}

export function TweetCard({ tweet }: TweetCardProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  
  const [optimisticLike, setOptimisticLike] = useOptimistic(
    { likesCount: tweet.likesCount, hasLiked: tweet.hasLiked },
    (state, newHasLiked: boolean) => ({
      likesCount: state.likesCount + (newHasLiked ? 1 : -1),
      hasLiked: newHasLiked,
    })
  );

  const handleAuthAction = (e: React.MouseEvent, action?: () => void) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      setShowSignIn(true);
      return;
    }

    action?.();
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      setShowSignIn(true);
      return;
    }

    const newHasLiked = !optimisticLike.hasLiked;
    
    startTransition(() => {
      setOptimisticLike(newHasLiked);
    });

    const result = await toggleLike(tweet.id);
    if (result.error) {
      toast.error(result.error);
      startTransition(() => {
        setOptimisticLike(!newHasLiked);
      });
    }
  };

  const handleValidation = (e: React.MouseEvent) => {
    handleAuthAction(e);
  };

  return (
    <>
      <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} />
      <Card 
        className="rounded-none border-x-0 border-t-0 border-b border-border hover:bg-muted/10 transition-all duration-300 cursor-pointer group/card"
        onClick={() => router.push(`/tweet/${tweet.id}`)}
      >
        <CardHeader className="flex flex-row items-start gap-4 p-6 pb-0 space-y-0">
          <Avatar className="cursor-default rounded-none border border-border h-12 w-12 grayscale group-hover/card:grayscale-0 transition-all duration-500" onClick={(e) => e.stopPropagation()}>
            <AvatarImage src={tweet.author.avatarUrl || ''} alt={tweet.author.name} className="object-cover" />
            <AvatarFallback className="rounded-none">{tweet.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="font-heading italic uppercase text-sm tracking-widest hover:text-primary cursor-pointer transition-colors" onClick={(e) => e.stopPropagation()}>{tweet.author.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  @{tweet.author.username || tweet.author.name.toLowerCase().replace(/\s+/g, '_')}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground" suppressHydrationWarning>
                  {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: false })} ago
                </span>
              </div>
            </div>
            <div className="text-base text-foreground font-body leading-relaxed tracking-tight max-w-2xl">
              {tweet.content}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-4 pl-[calc(1.5rem+48px+1rem)]">
          <div className="flex items-center justify-between text-muted-foreground max-w-sm">
            <Button variant="ghost" size="icon" className="group h-8 w-8 hover:bg-transparent hover:text-primary" onClick={handleValidation}>
              <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
            </Button>
            <Button variant="ghost" size="icon" className="group h-8 w-8 hover:bg-transparent hover:text-accent-foreground" onClick={handleValidation}>
              <Repeat2 className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "group h-8 px-2 flex items-center gap-1 hover:bg-transparent hover:text-destructive transition-colors",
                optimisticLike.hasLiked && "text-destructive"
              )}
              onClick={handleLike}
            >
              <Heart className={cn("h-4 w-4 transition-transform group-hover:scale-110", optimisticLike.hasLiked && "fill-current")} />
              {optimisticLike.likesCount > 0 && (
                <span className="text-[10px] uppercase font-bold tracking-tighter">{optimisticLike.likesCount}</span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="group h-8 w-8 hover:bg-transparent hover:text-primary" onClick={handleValidation}>
              <Share className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

