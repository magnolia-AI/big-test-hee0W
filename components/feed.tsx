import { TweetWithAuthor } from '@/app/actions/tweets';
import { TweetCard } from './tweet-card';

interface FeedProps {
  tweets: TweetWithAuthor[];
}

export function Feed({ tweets }: FeedProps) {
  if (tweets.length === 0) {
    return (
      <div className="p-12 text-center space-y-4 bg-secondary/20">
        <p className="font-heading font-black text-2xl uppercase italic tracking-tighter opacity-20">The stream is silent.</p>
        <p className="text-xs uppercase tracking-widest opacity-40 font-bold">Signal the first perspective to curate this space.</p>
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

