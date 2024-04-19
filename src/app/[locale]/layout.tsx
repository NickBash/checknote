import 'cal-sans'

import { ModalProvider } from '@/components/modals/modal-provider'
import { PocketProvider } from '@/components/providers/pocket-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'

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
        <PocketProvider />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="checknote-theme-2"
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <main className="h-full">
              <Toaster position="bottom-center" />
              <ModalProvider locale={locale} />

              {children}
            </main>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
