'use client'

import { useSearch } from '@/hooks/use-search'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'

import { useDocuments } from '@/hooks/use-documents'
import { useUserStore } from '@/stores/use-user.store'
import { File } from 'lucide-react'

export const SearchCommand = () => {
  const user = useUserStore(state => state.user)
  const router = useRouter()
  const documents = useDocuments(state => state.documents)
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
      <CommandInput placeholder={`Search ${user?.fullName}'s Checknote...`} />
      <CommandList>
        <CommandEmpty>No result found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map(document => (
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
