import { TweetWithAuthor } from '@/app/actions/tweets';
import { TweetCard } from './tweet-card';

interface FeedProps {
  tweets: TweetWithAuthor[];
}

export function Feed({ tweets }: FeedProps) {
  if (tweets.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No tweets yet. Be the first to post!
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
}

