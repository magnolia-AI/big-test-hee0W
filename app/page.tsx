import { getTweets } from '@/app/actions/tweets';
import { Feed } from '@/components/feed';
import { TweetComposer } from '@/components/tweet-composer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
  const tweets = await getTweets();

  return (
    <div className="container max-w-2xl mx-auto border-x min-h-[calc(100vh-4rem)]">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b p-4">
        <h1 className="text-xl font-bold">Home</h1>
      </div>
      
      <TweetComposer />
      
      <Feed tweets={tweets} />
    </div>
  );
}

