import type { Metadata } from 'next'
import './globals.css'
import './modern.css'
import { ToastProvider } from '@/components/ui/toast'

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
      <body className="antialiased bg-slate-50">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
