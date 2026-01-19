import { getTweet } from '@/app/actions/tweets';
import { TweetCard } from '@/components/tweet-card';
import { TweetComposer } from '@/components/tweet-composer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function TweetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getTweet(id);

  if (!result) {
    notFound();
  }

  const { tweet, replies } = result;

  return (
    <div className="container max-w-2xl mx-auto border-x min-h-[calc(100vh-4rem)]">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b p-4 flex items-center gap-4">
        <Link href="/" className="hover:bg-muted/50 rounded-full p-2 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">Post</h1>
      </div>

      <div className="border-b">
        <TweetCard tweet={tweet} />
      </div>

      <div className="border-b">
        <TweetComposer 
          parentId={tweet.id} 
          placeholder="Post your reply" 
          className="border-none"
        />
      </div>

      <div className="flex flex-col">
        {replies.map((reply) => (
          <TweetCard key={reply.id} tweet={reply} />
        ))}
      </div>
    </div>
  );
}


