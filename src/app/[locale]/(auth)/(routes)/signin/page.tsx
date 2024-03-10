'use client'

import { usePocket } from '@/components/providers/pocket-provider'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

const SignIn = () => {
  const { login } = usePocket()
  const { push } = useRouter()
  const [init, setInit] = useState(false)
  const t = useTranslations('Signin')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  const onSubmit = useCallback(
    async (evt: React.MouseEvent<HTMLElement>) => {
      evt?.preventDefault()
      try {
        await login(email, pass)

        push('/')
      } catch (e) {
        console.error(e)
      }
    },
    [email, pass, login, push],
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
    <section className="dark:bg-[#1F1F1F]">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full rounded-lg border border-neutral-200 bg-neutral-100 shadow-lg shadow-zinc-400 dark:border dark:border-zinc-800 dark:bg-neutral-800 dark:shadow-zinc-950 sm:max-w-md md:mt-0 xl:p-0">
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
                  className="dark:bg-neutral-900"
                  placeholder="name@company.com"
                  onChange={e => setEmail(e.target.value)}
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
                  className="dark:bg-neutral-900"
                  placeholder="••••••••"
                  onChange={e => setPass(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-center">
                <Link href="#" className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline">
                  {t('forgout')}
                </Link>
              </div>
              <Button onClick={onSubmit} variant="default" className="w-full">
                {t('signinButton')}
              </Button>
              <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400">
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
