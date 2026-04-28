import type { Metadata } from 'next'
import { ThemeProvider } from '@/context/theme-context'
import { UserProvider } from '@/context/user-context'
import { ToastProvider } from '@/components/ui/toast'
import './globals.css'
import './modern.css'

export const metadata: Metadata = {
  title: 'FoodHouse SaaS | Modern Management Platform',
  description: 'Multi-branch food business management SaaS platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />
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
