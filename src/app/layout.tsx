import { ThemeProvider } from '@/context/theme-context'
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
      <body className="antialiased">
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
