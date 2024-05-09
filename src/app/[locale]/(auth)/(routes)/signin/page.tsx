'use client'

import { Spinner } from '@/components/spinner'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserStore } from '@/stores/use-user.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ClientResponseError } from 'pocketbase'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const BaseSchema = (t: (arg: string) => string) =>
  z.object({
    email: z.string(),
    password: z.string(),
  })

const SignIn = () => {
  const login = useUserStore(state => state.login)
  const { push } = useRouter()
  const [init, setInit] = useState(false)
  const t = useTranslations('Signin')
  const formSchema = BaseSchema(t)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [error, setError] = useState<string | undefined>('')

  const checkYandex = useUserStore(state => state.checkYandex)

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setError('')

    login(values.email, values.password)
      ?.then(res => {
        setTimeout(() => {
          push('/')
        }, 300)
      })
      .catch((e: ClientResponseError) => {
        if (e.data?.code) {
          setError(t('incorrectCredentials'))
        } else {
          setError(t('serverError'))
        }
      })
  }

  useEffect(() => {
    setInit(true)
  }, [])

  const onCheckYandex = () => {
    checkYandex()
      ?.then(res => (res ? push('/') : null))
      .catch(err => {
        console.log('yandex auth err', err)
      })
  }

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
            {error && <div className="text-red-600">{error}</div>}
            <Form {...form}>
              <form className="space-y-4 md:space-y-6" action="#" onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label>{t('email')}</Label>
                        <FormControl>
                          <Input placeholder="example@mail.com" className="dark:bg-neutral-900" {...field} />
                        </FormControl>
                        <FormMessage className="dark:text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label>{t('password')}</Label>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" className="dark:bg-neutral-900" {...field} />
                        </FormControl>
                        <FormMessage className="dark:text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <Button type="submit" variant="default" className="w-full">
                    {t('signinButton')}
                  </Button>
                  <Button
                    onClick={onCheckYandex}
                    className="mt-2 flex w-full cursor-pointer items-center justify-center bg-gray-200 hover:border hover:bg-background dark:bg-stone-700"
                    variant="ghost"
                    type="button"
                  >
                    {t('loginVia')}
                    <Image className="ml-1" src="/yandex-icon.png" alt="" height={26} width={26} />
                  </Button>
                </div>
              </form>
            </Form>

            <div className="flex items-center justify-center">
              <Link href="#" className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline">
                {t('forgout')}
              </Link>
            </div>
            <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400">
              {t('dontAccount')}{' '}
              <Link href="/signup" className="text-primary-600 dark:text-primary-500 font-medium hover:underline">
                {t('signupLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignIn
