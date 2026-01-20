import './globals.css'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { authServer } from '@/lib/auth/server'

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
  const headersList = await headers();
  const session = await authServer.api.getSession({
    headers: headersList,
  });

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full flex flex-col antialiased">
        <ThemeProvider defaultTheme="light" attribute="class">
          <AuthProvider>
            <SidebarProvider defaultOpen={true}>
              <AppSidebar user={session?.user} />
              <SidebarInset>
                <header className="flex items-center h-14 px-4 border-b md:hidden">
                  <SidebarTrigger />
                  <span className="ml-2 font-bold">Chirp</span>
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




