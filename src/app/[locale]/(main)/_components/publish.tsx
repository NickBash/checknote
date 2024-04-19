'use client'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { useOrigin } from '@/hooks/use-origin'
import { useDocuments, type DocumentCopy } from '@/stores'
import { Check, Copy, Globe } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface IPublishProps {
  initialData: DocumentCopy
}

export const Publish = ({ initialData }: IPublishProps) => {
  const t = useTranslations('Publish')

  const origin = useOrigin()
  const requestUpdateDocument = useDocuments(state => state.requestUpdateDocument)

  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const url = `${origin}/preview/${initialData.id}`

  const onPublish = async () => {
    setIsSubmitting(true)

    await requestUpdateDocument(initialData.id, { isPublished: true })

    setIsSubmitting(false)

    // toast.promise(promise, {
    //   loading: 'Publishing...',
    //   success: 'Note published!',
    //   error: 'Failed to publish note.',
    // });
  }

  const onUnpublish = async () => {
    setIsSubmitting(true)

    await requestUpdateDocument(initialData.id, { isPublished: false })

    setIsSubmitting(false)

    // toast.promise(promise, {
    //   loading: 'Unpublishing...',
    //   success: 'Note unpublished!',
    //   error: 'Failed to unpublish note.',
    // });
  }

  const onCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          {t('publish')}
          {initialData.isPublished && <Globe className="ml-2 h-4 w-4 text-sky-500" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount asChild>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="h-4 w-4 animate-pulse text-sky-500" />
              <p className="text-xs font-medium text-sky-500">{t('liveNote')}</p>
            </div>
            <div className="flex items-center">
              <input className="h-8 flex-1 truncate rounded-l-md border bg-muted px-2 text-xs" value={url} disabled />
              <Button onClick={onCopy} disabled={copied} className="h-8 rounded-l-none">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button size="sm" className="w-full text-xs" disabled={isSubmitting} onClick={onUnpublish}>
              {t('unpublish')}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium">{t('publishThisNote')}</p>
            <span className="mb-4 text-xs text-muted-foreground">{t('share')}</span>
            <Button disabled={isSubmitting} onClick={onPublish} className="w-full text-xs" size="sm">
              {t('publishButton')}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
