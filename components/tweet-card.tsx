'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TweetWithAuthor, toggleLike } from '@/app/actions/tweets';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useOptimistic, startTransition } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';

interface TweetCardProps {
  tweet: TweetWithAuthor;
}

export function TweetCard({ tweet }: TweetCardProps) {
  const router = useRouter();
  const [optimisticLike, setOptimisticLike] = useOptimistic(
    { likesCount: tweet.likesCount, hasLiked: tweet.hasLiked },
    (state, newHasLiked: boolean) => ({
      likesCount: state.likesCount + (newHasLiked ? 1 : -1),
      hasLiked: newHasLiked,
    })
  );

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newHasLiked = !optimisticLike.hasLiked;
    
    startTransition(() => {
      setOptimisticLike(newHasLiked);
    });

    const result = await toggleLike(tweet.id);
    if (result.error) {
      toast.error(result.error);
      startTransition(() => {
        setOptimisticLike(!newHasLiked); // Revert
      });
    }
  };

  const handleValidation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className="rounded-none border-x-0 border-t-0 border-b hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => router.push(`/tweet/${tweet.id}`)}
    >
      <CardHeader className="flex flex-row items-start gap-4 p-4 pb-0 space-y-0">
        <Avatar className="cursor-default" onClick={(e) => e.stopPropagation()}>
          <AvatarImage src={tweet.author.avatarUrl || ''} alt={tweet.author.name} />
          <AvatarFallback>{tweet.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm hover:underline cursor-pointer" onClick={(e) => e.stopPropagation()}>{tweet.author.name}</span>
            <span className="text-muted-foreground text-sm">
              @{tweet.author.username || tweet.author.name.toLowerCase().replace(/\s+/g, '_')}
            </span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm" suppressHydrationWarning>
              {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
            </span>
          </div>
          <div className="text-sm text-foreground whitespace-pre-wrap break-words">
            {tweet.content}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pl-[calc(1rem+40px+1rem)]">
        <div className="flex items-center justify-between text-muted-foreground max-w-sm">
          <Button variant="ghost" size="icon" className="group h-8 w-8 hover:text-blue-500" onClick={handleValidation}>
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="group h-8 w-8 hover:text-green-500" onClick={handleValidation}>
            <Repeat2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "group h-8 px-2 flex items-center gap-1 hover:text-pink-500",
              optimisticLike.hasLiked && "text-pink-500"
            )}
            onClick={handleLike}
          >
            <Heart className={cn("h-4 w-4", optimisticLike.hasLiked && "fill-current")} />
            {optimisticLike.likesCount > 0 && (
              <span className="text-xs">{optimisticLike.likesCount}</span>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="group h-8 w-8 hover:text-blue-500" onClick={handleValidation}>
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


