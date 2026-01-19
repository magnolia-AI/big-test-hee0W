'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, Bell, Mail, User, Settings, PenLine, LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function LeftSidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Explore', href: '/explore' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Mail, label: 'Messages', href: '/messages' },
    { icon: User, label: 'Profile', href: user ? `/profile/${user.id}` : '/auth/sign-in' },
    { icon: Settings, label: 'Settings', href: '/account/settings' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 border-r min-h-screen p-4 sticky top-0 h-screen justify-between">
      <div className="space-y-6">
        <div className="px-4 py-2">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Magnolia
          </Link>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.label}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-xl py-6 rounded-full gap-4",
                  isActive && "font-bold bg-accent"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className={cn("h-7 w-7", isActive && "stroke-[3px]")} />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        <Button className="w-full rounded-full h-12 text-lg font-bold shadow-lg" size="lg">
          <PenLine className="mr-2 h-5 w-5" />
          Post
        </Button>
      </div>

      <div className="mt-auto">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start h-auto p-3 rounded-full hover:bg-accent">
                <div className="flex items-center gap-3 text-left">
                  <Avatar>
                    <AvatarImage src={user.image || ''} />
                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="font-bold truncate">{user.name}</span>
                    <span className="text-sm text-muted-foreground truncate">@{(user as any).username || 'user'}</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
           <div className="space-y-2 p-4 bg-muted/50 rounded-xl">
             <p className="font-bold">New to Magnolia?</p>
             <p className="text-sm text-muted-foreground mb-4">Sign up now to get your own personalized timeline!</p>
             <Button className="w-full rounded-full" asChild>
               <Link href="/auth/sign-up">Sign up</Link>
             </Button>
             <Button variant="outline" className="w-full rounded-full" asChild>
               <Link href="/auth/sign-in">Sign in</Link>
             </Button>
           </div>
        )}
      </div>
    </div>
  );
}


