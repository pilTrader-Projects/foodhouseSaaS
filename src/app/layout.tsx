import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/context/theme-context'
import { UserProvider } from '@/context/user-context'
import { ToastProvider } from '@/components/ui/toast'
import './globals.css'
import './modern.css'

export const metadata: Metadata = {
  title: 'FoodHouse SaaS | Modern Management Platform',
  description: 'Multi-branch food business management SaaS platform.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FoodHouse SaaS',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              var theme = localStorage.getItem('foodhouse_theme') || 'dark';
              document.documentElement.classList.toggle('dark', theme === 'dark');
              document.documentElement.setAttribute('data-theme', theme);
            } catch (e) {}
          `}
        </Script>
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <UserProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
