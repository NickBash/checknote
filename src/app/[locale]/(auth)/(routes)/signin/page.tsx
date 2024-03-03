'use client'

import { usePocket } from '@/components/providers/pocket-provider'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

const SignIn = () => {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login, user } = usePocket()
  const { push } = useRouter()
  const [init, setInit] = useState(false)
  const t = useTranslations('Signin')

  const onSubmit = useCallback(
    async (evt: React.MouseEvent<HTMLElement>) => {
      evt?.preventDefault()
      try {
        await login(emailRef.current.value, passwordRef.current.value)

        push('/')
      } catch (e) {
        console.error(e)
      }
    },
    [login, user],
  )

  useEffect(() => {
    setInit(true)
  }, [])

  if (!init) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              {t('title')}
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  {t('email')}
                </label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  placeholder="name@company.com"
                  ref={emailRef}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  {t('password')}
                </label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  ref={passwordRef}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <Input id="remember" aria-describedby="remember" type="checkbox" required />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                      {t('remember')}
                    </label>
                  </div>
                </div>
                <Link href="#" className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline">
                  {t('forgout')}
                </Link>
              </div>
              <Button onClick={onSubmit} variant="default" className="w-full">
                {t('signinButton')}
              </Button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                {t('dontAccount')}{' '}
                <Link href="#" className="text-primary-600 dark:text-primary-500 font-medium hover:underline">
                  {t('signupLink')}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignIn
