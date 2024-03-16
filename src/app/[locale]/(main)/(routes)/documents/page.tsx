'use client'

import { Button } from '@/components/ui/button'
import { useDocuments } from '@/hooks/use-documents'
import { usePocketbaseStore } from '@/stores/use-pocketbase.store'
import { useUserStore } from '@/stores/use-user.store'
import { PlusCircle } from 'lucide-react'
import Image from 'next/image'

const DocumentPage = () => {
  const pb = usePocketbaseStore(state => state.pocketbaseClient)
  const user = useUserStore(state => state.user)
  const createDocument = useDocuments(state => state.createDocuments)

  const onCreate = () => {
    createDocument(pb as any, user as Record<string, any>)
  }

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <Image src="/black-box.png" alt="Document" height="300" width="300" className="object-contain" />
      <h2 className="text-lg font-medium">Welcome to {user?.firstName}&apos;s Checknote</h2>
      <Button onClick={onCreate}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create a note
      </Button>
    </div>
  )
}

export default DocumentPage
