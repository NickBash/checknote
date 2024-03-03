import { Pathnames } from 'next-intl/navigation'

export const locales = ['ru', 'en'] as const

export const pathnames = {
  '/': '/',
  '/pathnames': {
    ru: '/pathnames',
    en: '/pathnames',
  },
  '/api': {
    ru: '/api',
    en: '/api',
  },
} satisfies Pathnames<typeof locales>

export const localePrefix = undefined

export type AppPathnames = keyof typeof pathnames
