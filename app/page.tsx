import { getTweets } from '@/app/actions/tweets';
import { Feed } from '@/components/feed';
import { TweetComposer } from '@/components/tweet-composer';
import { RightSidebar } from '@/components/right-sidebar';

export default async function Home() {
  const tweets = await getTweets();

  return (
    <div className="container mx-auto max-w-7xl min-h-screen flex justify-center lg:gap-8">
      
      <main className="flex-1 max-w-2xl w-full border-x min-h-screen pb-20 md:pb-0">
        <div className="sticky top-0 z-10 bg-background/85 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Home</h1>
          {/* Mobile logo could go here if header was removed, but we kept mobile header */}
        </div>
        
        <TweetComposer />
        
        <Feed tweets={tweets} />
      </main>

      <RightSidebar />
    </div>
  );
}


