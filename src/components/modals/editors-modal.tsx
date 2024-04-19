'use client'

import { useDocuments, useEditorsModal, useUserStore, type UserDB } from '@/stores'
import { ArrowLeft, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'
import { Input } from '../ui/input'

export const EditorsModal = () => {
  const t = useTranslations('EditorsModal')

  const params = useParams()

  const listDocuments = useDocuments(state => state.listDocuments)

  const documentCopy = useMemo(
    () => listDocuments.find(doc => doc.id === params.documentId),
    [params.documentId, listDocuments],
  )

  const isOpenModal = useEditorsModal(state => state.isOpen)
  const onCloseModal = useEditorsModal(state => state.onClose)

  const requestUpdateEditors = useDocuments(state => state.requestUpdateEditors)
  const requestRemoveEditor = useDocuments(state => state.requestRemoveEditor)

  const findUser = useUserStore(state => state.findUser)
  const user = useUserStore(state => state.user)

  const [search, setSearch] = useState('')
  const [searchMode, setSearchMode] = useState(false)
  const [searchResult, setSearchResult] = useState<UserDB[]>([])

  const onReset = () => {
    setSearchMode(false)
    setSearch('')
  }

  const onClose = () => {
    onReset()
    setSearchResult([])
    onCloseModal()
    setTimeout(() => {
      document.body.style.pointerEvents = ''
    }, 500)
  }

  const onRemoveUser = async (id: string) => {
    const documentId = params.documentId as string

    await requestRemoveEditor(documentId, id)
  }

  const onSearch = async () => {
    if (search) {
      const result: UserDB[] = await findUser(search)

      setSearchResult(result.filter(u => u.email !== user?.email))
    }
  }

  const onFocus = () => {
    setSearchMode(true)
  }

  const onAddUser = async (id: string) => {
    const documentId = params.documentId as string

    await requestUpdateEditors(documentId, id)
  }

  return (
    <Dialog open={isOpenModal} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">{t('title')}</h2>
        </DialogHeader>
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex w-full flex-col justify-between gap-y-2">
            {searchMode && (
              <Button onClick={onReset} size="icon">
                <ArrowLeft />
              </Button>
            )}
            <label className="text-sm">{t('label')}</label>
            <div className="grid w-full grid-cols-[1fr_max-content] gap-x-2">
              <Input
                name="email"
                id="email"
                className="dark:bg-neutral-900"
                placeholder="name@company.com"
                onChange={e => setSearch(e.target.value)}
                onFocus={onFocus}
              />
              <Button className="h-full" onClick={onSearch}>
                <Search />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          {!searchMode && (
            <div className="flex w-full flex-col gap-y-2">
              <label className="text-sm">{t('label2')}</label>
              <div className="flex max-h-32 flex-wrap items-center gap-y-2 overflow-y-auto">
                {documentCopy &&
                  documentCopy.expand?.editors?.map(value => (
                    <div className="flex w-full items-center justify-between" key={value.id}>
                      {value.email}
                      <Button onClick={() => onRemoveUser(value.id)} className="h-6" variant="destructive">
                        {t('remove')}
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {searchMode && (
            <div className="flex w-full flex-col gap-y-2">
              <label className="text-sm">{searchResult.length ? t('foundYourRequest') : t('noUsersFound')}</label>
              {searchResult.map(value => (
                <div className="flex w-full items-center justify-between" key={value.id}>
                  {value.email}
                  {documentCopy?.editors?.includes(value.id) ? (
                    <Button onClick={() => onRemoveUser(value.id)} className="h-6" variant="destructive">
                      {t('remove')}
                    </Button>
                  ) : (
                    <Button onClick={() => onAddUser(value.id)} className="h-6" variant="secondary">
                      {t('add')}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
