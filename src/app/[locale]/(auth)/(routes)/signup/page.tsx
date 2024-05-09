'use client'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserStore } from '@/stores/use-user.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ClientResponseError } from 'pocketbase'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const BaseSchema = (t: (arg: string) => string) =>
  z
    .object({
      email: z
        .string()
        .min(1, { message: t('emailIsEmpty') })
        .max(80, { message: t('emailMaxLength') })
        .email(t('validEmail')),
      password: z
        .string()
        .min(8, { message: t('minPassword') })
        .max(30, { message: t('maxPassword') }),
      confirmPassword: z
        .string()
        .min(8, { message: t('minPassword') })
        .max(30, { message: t('maxPassword') }),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: t('passwordMismatch'),
      path: ['confirmPassword'],
    })

const SignUp = () => {
  const t = useTranslations('Signup')
  const formSchema = BaseSchema(t)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const register = useUserStore(state => state.register)
  const { push } = useRouter()

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setError('')

    startTransition(() => {
      register(values.email, values.password)
        ?.then(data => {
          setSuccess(true)

          setTimeout(() => {
            push('/signin')
          }, 800)
        })
        ?.catch((e: ClientResponseError) => {
          if (e?.data?.data?.email?.message === 'The email is invalid or already in use.') {
            setError(t('emailAlredyUse'))
          } else {
            setError(t('unknowError'))
          }
        })
    })
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
                  <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label>{t('confirmPassword')}</Label>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" className="dark:bg-neutral-900" {...field} />
                        </FormControl>
                        <FormMessage className="dark:text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>
                {success ? (
                  <div className="flex h-10 w-full items-center justify-center gap-x-2 rounded-sm bg-green-600 text-foreground text-white  dark:bg-green-700">
                    <Check />
                    {t('successRegister')}
                  </div>
                ) : (
                  <Button type="submit" variant="default" className="w-full" disabled={isPending}>
                    {t('signupButton')}
                  </Button>
                )}
                <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400">
                  {t('haveAccount')}{' '}
                  <Link href="/signin" className="text-primary-600 dark:text-primary-500 font-medium hover:underline">
                    {t('signinLink')}
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignUp
