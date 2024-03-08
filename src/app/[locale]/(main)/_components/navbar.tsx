import { useDocuments, type Document } from '@/hooks/use-documents'
import { MenuIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { Banner } from './banner'
import { Menu } from './menu'
import { Publish } from './publish'
import { Title } from './title'

interface NavbarProps {
  isCollapsed: boolean
  onResetWidth: () => void
}

export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams()
  const documents = useDocuments(state => state.documents)

  const documentCopy = documents?.find((doc: Document) => doc.id === params.documentId)

  if (documentCopy === undefined) {
    return (
      <nav className="flex w-full items-center justify-between bg-background px-3 py-2 dark:bg-[#1F1F1F]">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    )
  }

  if (documentCopy === null) {
    return null
  }

  return (
    <>
      <nav className="flex w-full items-center gap-x-4 border-b bg-background px-3 py-2 shadow-sm dark:bg-[#1F1F1F]">
        {isCollapsed && <MenuIcon role="button" onClick={onResetWidth} className="h-6 w-6 text-muted-foreground" />}
        <div className="flex w-full items-center justify-between">
          <Title initialData={documentCopy} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={documentCopy} />
            <Menu documentId={documentCopy.id} />
          </div>
        </div>
      </nav>
      {documentCopy.isArchived && <Banner documentId={documentCopy.id} />}
    </>
  )
}
