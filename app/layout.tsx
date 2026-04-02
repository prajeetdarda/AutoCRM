import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import ThemeToggle from '@/components/ThemeToggle'
import './globals.css'

export const metadata: Metadata = {
  title: 'AutoCRM',
  description: 'Multi-Agent Autonomous Support System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ThemeToggle />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
