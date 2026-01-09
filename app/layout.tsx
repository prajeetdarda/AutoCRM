import type { Metadata } from 'next'
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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
