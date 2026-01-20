'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, Bell, Mail, User, Settings, PenLine, LogOut, Bird } from 'lucide-react';
import { authClient } from '@/lib/auth/client';
import { getProfile } from '@/app/actions/profile';
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
  
  const [dbUser, setDbUser] = useState<any>(null);
  const authUser = session?.user || initialUser;
  const displayUser = dbUser ? { ...authUser, ...dbUser } : authUser;
  
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  useEffect(() => {
    async function fetchDBProfile() {
      if (authUser?.id) {
        try {
          const profile = await getProfile();
          if (profile) setDbUser(profile);
        } catch (error) {
          console.error('Failed to fetch sidebar profile:', error);
        }
      }
    }
    fetchDBProfile();
  }, [authUser?.id]);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  const navItems = [
    { icon: Home, label: 'Discourse', href: '/' },
    { icon: Search, label: 'Search', href: '/explore' },
    { icon: Bell, label: 'Signals', href: '/notifications' },
    { icon: Mail, label: 'Letters', href: '/messages' },
    { icon: User, label: 'Journal', href: displayUser ? `/profile/${displayUser.id}` : '/auth/sign-in' },
    { icon: Settings, label: 'System', href: '/account/settings' },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-background">
      <SidebarHeader className="h-24 flex-row items-center px-6">
        <Link href="/" className={cn("flex items-center gap-2 group transition-all", isCollapsed && "hidden")}>
          <Bird className="h-8 w-8 text-primary" />
          <span className="logo-text text-3xl">
            Chirp
          </span>
        </Link>
        <SidebarTrigger className={cn("ml-auto", isCollapsed && "mx-auto")} />
      </SidebarHeader>

      <SidebarContent className="px-4 gap-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className={cn(
                    "h-12 text-lg px-4 transition-all duration-200 uppercase tracking-widest font-heading rounded-none border-l-2 border-transparent",
                    isActive ? "border-primary text-primary bg-accent/10 font-black italic" : "hover:border-primary/30 hover:bg-transparent"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className={cn("h-5 w-5 mr-3", isActive && "text-primary")} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <div className={cn("mt-8", isCollapsed && "flex justify-center")}>
            <Button 
              className="w-full rounded-none h-14 text-sm font-bold uppercase tracking-[0.2em] shadow-none bg-primary text-primary-foreground hover:bg-primary/90 transition-transform active:scale-95"
              size={isCollapsed ? "icon" : "lg"}
            >
                {isCollapsed ? <PenLine className="h-5 w-5" /> : "Post Thread"}
            </Button>
        </div>
      </SidebarContent>

      <SidebarFooter className={cn("p-6", isCollapsed && "p-2")}>
        {displayUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className={cn(
                    "hover:bg-accent/10 rounded-none h-auto py-3 border border-transparent hover:border-border transition-all",
                    isCollapsed && "py-0 justify-center h-12 w-12"
                )}
              >
                <div className={cn("flex items-center gap-4 text-left w-full", isCollapsed && "justify-center")}>
                  <Avatar className={cn("h-10 w-10 grayscale rounded-none border border-border", isCollapsed && "h-8 w-8")}>
                    <AvatarImage src={displayUser.image || ''} className="object-cover" />
                    <AvatarFallback className="rounded-none">{displayUser.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 overflow-hidden transition-all group-data-[collapsible=icon]:hidden">
                    <span className="font-heading italic uppercase text-xs tracking-wider truncate">{displayUser.name}</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground truncate">@{displayUser.username || 'user'}</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-none border-border" side="right">
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer uppercase text-xs tracking-widest font-bold">
                <LogOut className="mr-2 h-4 w-4" />
                Discard Session
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
             !isCollapsed && (
                 <div className="space-y-4 p-6 border border-border rounded-none bg-secondary/50">
                    <p className="font-heading uppercase text-xs tracking-[0.2em] opacity-50">Join the discourse</p>
                    <Button className="w-full rounded-none uppercase text-xs tracking-widest h-10" asChild>
                      <Link href="/auth/sign-up">Enroll</Link>
                    </Button>
                 </div>
             )
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

