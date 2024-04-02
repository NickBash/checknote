'use client'

import { useTranslations } from 'next-intl'

const ConfirmAccount = () => {
  const t = useTranslations('Signup')

  return (
    <section className="dark:bg-[#1F1F1F]">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full rounded-lg border border-neutral-200 bg-neutral-100 shadow-lg shadow-zinc-400 dark:border dark:border-zinc-800 dark:bg-neutral-800 dark:shadow-zinc-950 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              {t('title')}
            </h1>
            <p>На ваш email адрес выслано письмо для подтверждения вашего аккаунта</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConfirmAccount
