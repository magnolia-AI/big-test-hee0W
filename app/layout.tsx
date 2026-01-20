import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export const metadata: Metadata = {
  title: 'Chirp',
  description: 'A social platform for everyone',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full flex flex-col antialiased">
        <ThemeProvider defaultTheme="light" attribute="class">
          <AuthProvider>
            <SidebarProvider defaultOpen={true}>
              <AppSidebar />
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



