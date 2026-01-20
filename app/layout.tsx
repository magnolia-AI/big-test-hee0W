import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { authServer } from '@/lib/auth/server'
import { Bodoni_Moda, Inter } from "next/font/google";

import { Bird } from 'lucide-react'

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Chirp | Digital Poetry',
  description: 'High-fashion internet discourse.',
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
    <html lang="en" className={`${bodoni.variable} ${inter.variable} h-full`} suppressHydrationWarning>
      <body className="h-full flex flex-col antialiased font-body">
        <ThemeProvider defaultTheme="light" attribute="class">
          <AuthProvider>
            <SidebarProvider defaultOpen={true}>
              <AppSidebar user={session?.user} />
              <SidebarInset className="border-l border-border">
                <header className="flex items-center h-16 px-4 border-b md:hidden bg-background/80 backdrop-blur-md sticky top-0 z-50">
                  <SidebarTrigger />
                  <div className="flex items-center gap-2 ml-3">
                    <Bird className="h-6 w-6 text-primary" />
                    <span className="logo-text text-2xl">
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

