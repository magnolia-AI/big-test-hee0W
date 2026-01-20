import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { authServer } from '@/lib/auth/server'

import { Bird } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Chirp',
  description: 'A social platform for everyone',
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = await authServer.getSession();

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full flex flex-col antialiased">
        <ThemeProvider defaultTheme="light" attribute="class">
          <AuthProvider>
            <SidebarProvider defaultOpen={true}>
              <AppSidebar user={session?.user} />
              <SidebarInset>
                <header className="flex items-center h-16 px-4 border-b md:hidden bg-background/80 backdrop-blur-md sticky top-0 z-50">
                  <SidebarTrigger />
                  <div className="flex items-center gap-2 ml-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-purple-600 shadow-sm">
                      <Bird className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-black tracking-tighter text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      Chirp
                    </span>
                  </div>
                </header>
                <main className="flex-1">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}








