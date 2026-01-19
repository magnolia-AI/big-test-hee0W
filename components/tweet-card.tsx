import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TweetWithAuthor } from '@/app/actions/tweets';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TweetCardProps {
  tweet: TweetWithAuthor;
}

export function TweetCard({ tweet }: TweetCardProps) {
  return (
    <Card className="rounded-none border-x-0 border-t-0 border-b hover:bg-muted/30 transition-colors">
      <CardHeader className="flex flex-row items-start gap-4 p-4 pb-0 space-y-0">
        <Avatar>
          <AvatarImage src={tweet.author.avatarUrl || ''} alt={tweet.author.name} />
          <AvatarFallback>{tweet.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">{tweet.author.name}</span>
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
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-500">
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-green-500">
            <Repeat2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-pink-500">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-500">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


