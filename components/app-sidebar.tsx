'use client';

import Link from 'next/link';
import { Home, Search, Bell, Mail, User, Settings, PenLine, LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppSidebar({ user: initialUser }: { user?: any }) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user || initialUser;
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  const handlePostClick = () => {
    const composer = document.getElementById('main-tweet-composer');
    if (composer) {
      composer.focus();
      composer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="h-16 flex-row items-center justify-between px-4">
        <Link href="/" className={cn("text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent transition-all", isCollapsed && "hidden")}>
          Chirp
        </Link>
        <SidebarTrigger className={cn(isCollapsed && "mx-auto")} />
      </SidebarHeader>

      <SidebarContent className="px-2 gap-4">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className="h-12 text-lg rounded-full px-4 data-[active=true]:font-bold data-[active=true]:bg-accent"
                >
                  <Link href={item.href}>
                    <item.icon className={cn("h-6 w-6", isActive && "stroke-[3px]")} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <div className={cn("px-2 mt-4", isCollapsed && "px-0 flex justify-center")}>
            {isCollapsed ? (
                 <Button onClick={handlePostClick} className="rounded-full h-10 w-10 p-0 aspect-square shadow-lg" size="icon">
                    <PenLine className="h-5 w-5" />
                 </Button>
            ) : (
                <Button onClick={handlePostClick} className="w-full rounded-full h-12 text-lg font-bold shadow-lg" size="lg">
                    <PenLine className="mr-2 h-5 w-5" />
                    Post
                </Button>
            )}
        </div>
      </SidebarContent>

      <SidebarFooter className={cn("p-4", isCollapsed && "p-1")}>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className={cn(
                    "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-full h-auto py-2",
                    isCollapsed && "py-0 justify-center h-10 w-10"
                )}
              >
                <div className={cn("flex items-center gap-3 text-left w-full", isCollapsed && "justify-center")}>
                  <Avatar className={cn("h-10 w-10", isCollapsed && "h-8 w-8")}>
                    <AvatarImage src={user.image || ''} />
                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 overflow-hidden transition-all group-data-[collapsible=icon]:hidden">
                    <span className="font-bold truncate">{user.name}</span>
                    <span className="text-xs text-muted-foreground truncate">@{(user as any).username || 'user'}</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" side="right">
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
             !isCollapsed && (
                 <div className="space-y-2 p-4 bg-muted/50 rounded-xl group-data-[collapsible=icon]:hidden">
                    <p className="font-bold">New to Chirp?</p>
                    <p className="text-sm text-muted-foreground mb-4">Sign up now!</p>
                    <Button className="w-full rounded-full" asChild>
                    <Link href="/auth/sign-up">Sign up</Link>
                    </Button>
                 </div>
             )
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}









