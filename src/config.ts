import { Pathnames } from 'next-intl/navigation'

export const locales = ['ru', 'en'] as const

export const pathnames = {
  '/': '/',
  '/pathnames': {
    ru: '/pathnames',
    en: '/pathnames',
  },
} satisfies Pathnames<typeof locales>

export const localePrefix = 'as-needed'

export type AppPathnames = keyof typeof pathnames
