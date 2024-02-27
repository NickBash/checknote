import type { Metadata } from 'next'
import './globals.css'

import 'cal-sans'

import { ModalProvider } from '@/components/modals/modal-provider'
import { ConvexClientProvider } from '@/components/providers/convex-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { EdgeStoreProvider } from '@/lib/edgestore'
import '@fontsource/inter/100.css'
import '@fontsource/inter/200.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Checknote',
  description:
    'Tiptap is a suite of open source content editing and real-time collaboration tools for developers building apps like Notion or Google Docs.',
  robots: 'noindex, nofollow',
  icons: [{ url: '/favicon.svg' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="h-full font-sans" lang="en" suppressHydrationWarning>
      <body className="flex h-full flex-col">
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="checknote-theme-2"
            >
              <Toaster position="bottom-center" />
              <ModalProvider />
              <main className="h-full">{children}</main>
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
