import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function RightSidebar() {
  return (
    <div className="hidden xl:flex flex-col w-80 p-4 sticky top-0 h-screen space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search Magnolia" 
          className="pl-10 rounded-full bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      <Card className="rounded-xl bg-muted/30 border-none shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">What&apos;s happening</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="cursor-pointer hover:bg-muted/50 p-2 -mx-2 rounded-lg transition-colors space-y-1">
            <div className="text-xs text-muted-foreground">Technology · Trending</div>
            <div className="font-bold">#NextJS16</div>
            <div className="text-xs text-muted-foreground">12.5K posts</div>
          </div>
          <div className="cursor-pointer hover:bg-muted/50 p-2 -mx-2 rounded-lg transition-colors space-y-1">
            <div className="text-xs text-muted-foreground">Design · Trending</div>
            <div className="font-bold">UI/UX Revolution</div>
            <div className="text-xs text-muted-foreground">8,942 posts</div>
          </div>
          <div className="cursor-pointer hover:bg-muted/50 p-2 -mx-2 rounded-lg transition-colors space-y-1">
            <div className="text-xs text-muted-foreground">Development · Trending</div>
            <div className="font-bold">TypeScript</div>
            <div className="text-xs text-muted-foreground">54K posts</div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl bg-muted/30 border-none shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Who to follow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold truncate text-sm">Design Star</span>
                  <span className="text-xs text-muted-foreground truncate">@design_star</span>
                </div>
              </div>
              <Button size="sm" variant="secondary" className="rounded-full h-8 px-4 font-bold">
                Follow
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground px-4 flex flex-wrap gap-2">
        <span>&copy; 2026 Magnolia</span>
        <span className="hover:underline cursor-pointer">Terms</span>
        <span className="hover:underline cursor-pointer">Privacy</span>
        <span className="hover:underline cursor-pointer">Cookies</span>
      </div>
    </div>
  );
}


