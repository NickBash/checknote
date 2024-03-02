import createMiddleware from 'next-intl/middleware'
import { localePrefix } from './config'

export default createMiddleware({
  locales: ['ru', 'en'],
  localePrefix,
  defaultLocale: 'ru',
})

// export const config = {
//   matcher: ['/((?!api|_next|.*\\..*).*)'],
// }

export const config = {
  matcher: ['/', '/(ru|en)/:path*'],
}
