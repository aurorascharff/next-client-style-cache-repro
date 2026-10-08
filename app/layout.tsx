import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { StyleProvider } from '../components/style-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Client style cache reproduction',
  description: 'Reproduces blocking-prerender-random-client.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyleProvider>{children}</StyleProvider>
      </body>
    </html>
  )
}
