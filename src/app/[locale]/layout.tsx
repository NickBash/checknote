import 'cal-sans'

import { ModalProvider } from '@/components/modals/modal-provider'
import { ConvexClientProvider } from '@/components/providers/convex-provider'
import { PocketProvider } from '@/components/providers/pocket-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { EdgeStoreProvider } from '@/lib/edgestore'

import { NextIntlClientProvider, useMessages } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { Toaster } from 'react-hot-toast'

const locales = ['ru', 'en']

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export async function generateMetadata({ params: { locale } }: Root) {
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title: t('title'),
    description: t('description'),
    robots: t('robots'),
    icons: [{ url: '/favicon.svg' }],
  }
}

interface Root {
  children: React.ReactNode
  params: { locale: string }
}

export default function RootLayout({ children, params: { locale } }: Root) {
  unstable_setRequestLocale(locale)

  const messages = useMessages()

  return (
    <html className="h-full font-sans" lang={locale} suppressHydrationWarning>
      <body className="flex h-full flex-col">
        <ConvexClientProvider>
          <PocketProvider>
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
                <main className="h-full">
                  <NextIntlClientProvider locale={locale} messages={messages}>
                    {children}
                  </NextIntlClientProvider>
                </main>
              </ThemeProvider>
            </EdgeStoreProvider>
          </PocketProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
