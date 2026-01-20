'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth/client';
import { Loader2, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getProfile, updateProfile } from '@/app/actions/profile';

export default function SettingsPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [dbUser, setDbUser] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch profile data from database
  useEffect(() => {
    const fetchProfile = async () => {
      setIsProfileLoading(true);
      try {
        const profile = await getProfile();
        setDbUser(profile);
        if (profile?.name) setName(profile.name);
        if (profile?.username) setUsername(profile.username || '');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      const result = await updateProfile({
        name,
        username,
      });

      if (result.error) {
        setUpdateMessage({ type: 'error', text: result.error });
      } else {
        setUpdateMessage({ type: 'success', text: 'Signal updated. Re-broadcasting profile.' });
        const updatedProfile = await getProfile();
        setDbUser(updatedProfile);
        if (updatedProfile?.name) setName(updatedProfile.name);
        if (updatedProfile?.username) setUsername(updatedProfile.username || '');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setUpdateMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isSessionPending || isProfileLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-none border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="pt-6">
            <p className="text-center font-heading font-black uppercase italic tracking-tighter">
              Identity required for discourse.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-12 px-6">
        <div className="space-y-2 mb-12 border-l-4 border-primary pl-6">
          <h1 className="text-5xl font-heading font-black uppercase tracking-tighter italic leading-none">Perspective Control</h1>
          <p className="text-muted-foreground uppercase tracking-widest text-xs">Curate your digital signal and editorial presence.</p>
        </div>

        <div className="grid gap-12">
          <Card className="rounded-none border-0 shadow-none bg-transparent">
            <CardHeader className="px-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary text-primary-foreground transform -rotate-12">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="font-heading font-black text-2xl uppercase tracking-tight">Identity Details</CardTitle>
                  <CardDescription className="uppercase text-[10px] tracking-[0.2em] font-bold opacity-60">Your signal signature</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0 pt-8 border-t-2 border-primary">
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                {updateMessage && (
                  <Alert variant={updateMessage.type === 'error' ? 'destructive' : 'default'} className={cn(
                    "rounded-none border-2 font-bold",
                    updateMessage.type === 'success' ? 'border-accent bg-accent/20 text-primary uppercase text-xs tracking-wider' : 'border-destructive'
                  )}>
                    {updateMessage.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    <AlertDescription>{updateMessage.text}</AlertDescription>
                  </Alert>
                )}
                
                <div className="grid gap-10 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="uppercase font-black text-xs tracking-widest opacity-70">Editorial Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="rounded-none border-x-0 border-t-0 border-b-2 border-primary focus-visible:ring-0 focus-visible:border-accent bg-secondary/30 h-12 text-lg font-heading"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="username" className="uppercase font-black text-xs tracking-widest opacity-70">Handle</Label>
                    <div className="relative">
                      <span className="absolute left-0 top-3 font-mono text-muted-foreground">@</span>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        className="rounded-none border-x-0 border-t-0 border-b-2 border-primary focus-visible:ring-0 focus-visible:border-accent bg-secondary/30 pl-6 h-12 text-lg font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 sm:col-span-2">
                    <Label htmlFor="email" className="uppercase font-black text-xs tracking-widest opacity-70">Broadcast Channel</Label>
                    <Input
                      id="email"
                      value={user.email || ''}
                      disabled
                      className="rounded-none border-0 bg-secondary/50 h-10 italic opacity-50 cursor-not-allowed"
                    />
                    <p className="text-[10px] uppercase font-bold tracking-[0.1em] text-muted-foreground/60">
                      Channel modifications restricted to administration.
                    </p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                    className="rounded-none px-12 h-14 uppercase font-heading font-black tracking-[0.2em] transform hover:-translate-y-1 hover:translate-x-1 shadow-[-4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[-4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none transition-all"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      'Broadcasting Changes'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

