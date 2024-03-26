'use client'

import { Button } from '@/components/ui/button'
import { useDocuments } from '@/stores/use-documents.store'
import { useUserStore } from '@/stores/use-user.store'
import { PlusCircle } from 'lucide-react'
import Image from 'next/image'

const DocumentPage = () => {
  const user = useUserStore(state => state.user)
  const createDocument = useDocuments(state => state.requestСreateDocument)

  const onCreate = () => {
    createDocument()
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
