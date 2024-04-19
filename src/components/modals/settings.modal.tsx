'use client'

import { useSettings } from '@/hooks/use-settings'
import { useTranslations } from 'next-intl'
import { LangToggle } from '../lang-toggle'
import ModeToggle from '../mode-toggle'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'

export const SettingsModal = ({ locale }: { locale: string }) => {
  const t = useTranslations('SettingsModal')

  const isOpenModal = useSettings(state => state.isOpen)
  const onCloseModal = useSettings(state => state.onClose)

  return (
    <Dialog open={isOpenModal} onOpenChange={onCloseModal}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">{t('title')}</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <label>{t('theme')}</label>
          </div>
          <ModeToggle />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <label>{t('theme')}</label>
          </div>
          <LangToggle locale={locale} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
