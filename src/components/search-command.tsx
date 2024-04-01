'use client'

import { useSearch } from '@/hooks/use-search'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'

import { useDocuments } from '@/stores'
import { File } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const SearchCommand = () => {
  const t = useTranslations('searchCommand')

  const router = useRouter()
  const listDocuments = useDocuments(state => state.listDocuments)
  const [isMounted, setIsMounted] = useState(false)

  const toggle = useSearch(store => store.toggle)
  const isOpen = useSearch(store => store.isOpen)
  const onClose = useSearch(store => store.onClose)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener('keydown', down)

    return () => document.removeEventListener('keydown', down)
  }, [toggle])

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`)
    onClose()
  }

  if (!isMounted) {
    return null
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={t('placeholder')} />
      <CommandList>
        <CommandEmpty>{t('notFound')}</CommandEmpty>
        <CommandGroup heading={t('title')}>
          {listDocuments?.map(document => (
            <CommandItem
              key={document.id}
              value={`${document.id}-${document.title}`}
              title={document.title}
              onSelect={onSelect}
            >
              {document.icon ? <p className="mr-2 text-[18px]">{document.icon}</p> : <File className="mr-2 h-4 w-4" />}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
