'use client'

import { useDocuments, useEditorsModal, useTeamManagementStore, useUserStore, type UserDB } from '@/stores'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { EditorItem } from '../editor-item'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs'
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

  const teams = useTeamManagementStore(state => state.teams)

  const isOpenModal = useEditorsModal(state => state.isOpen)
  const onCloseModal = useEditorsModal(state => state.onClose)

  const requestGetTeams = useTeamManagementStore(state => state.requestGetTeams)
  const requestUpdateEditors = useDocuments(state => state.requestUpdateEditors)
  const requestRemoveEditor = useDocuments(state => state.requestRemoveEditor)
  const requestUpdateDocument = useDocuments(state => state.requestUpdateDocument)

  const findUser = useUserStore(state => state.findUser)
  const user = useUserStore(state => state.user)

  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState<UserDB[]>([])

  const onReset = () => {
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

  const onSearch = async () => {
    if (search) {
      const result: UserDB[] = await findUser(search)

      setSearchResult(result.filter(u => u.email !== user?.email))
    }
  }

  const onAddUser = async (id: string, role: string) => {
    const documentId = params.documentId as string

    await requestUpdateEditors(documentId, id, role)
  }

  const onRemoveUser = async (id: string) => {
    const documentId = params.documentId as string

    await requestRemoveEditor(documentId, id)
  }

  const onUpdateUser = async (id: string, role: string) => {
    const documentId = params.documentId as string

    await requestUpdateEditors(documentId, id, role)
  }

  const onRemoveTeam = async (id: string) => {
    const body = {
      teams: documentCopy?.teams?.filter(value => value !== id),
    }

    await requestUpdateDocument(documentCopy?.id as string, body)
  }

  const onAddTeam = async (id: string) => {
    const body = {
      teams: Array.isArray(documentCopy?.teams) ? [...documentCopy.teams, id] : [id],
    }

    console.log(documentCopy)

    await requestUpdateDocument(documentCopy?.id as string, body)
  }

  useEffect(() => {
    if (isOpenModal) {
      requestGetTeams()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenModal])

  return (
    <Dialog open={isOpenModal} onOpenChange={onClose}>
      <DialogContent className="w-[800px] max-w-[800px]">
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">{t('title')}</h2>
        </DialogHeader>

        <Tabs defaultValue="current" className="w-full">
          <TabsList>
            <TabsTrigger value="current">Редактирование списка</TabsTrigger>
            <TabsTrigger value="search">Поиск новых пользователей</TabsTrigger>
            <TabsTrigger value="teams">Команды</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <div className="flex flex-col gap-y-2">
              {/* <label className="text-sm">{t('label')}</label> */}
              <div className="grid w-full grid-cols-[1fr_max-content_max-content] gap-x-2">
                {/* <Input
                      name="email"
                      id="email"
                      className="dark:bg-neutral-900"
                      placeholder="name@company.com"
                      onChange={e => setSearch(e.target.value)}
                    />
                    <Button className="h-full" onClick={onSearch}>
                      <Search />
                    </Button> */}
              </div>
              <div className="flex w-full flex-col gap-y-2">
                <label className="text-sm">{t('label2')}</label>
                <div className="flex max-h-32 flex-wrap items-center gap-y-2 overflow-y-auto">
                  {documentCopy &&
                    documentCopy.expand?.editors?.map(value => (
                      <EditorItem
                        key={value.id}
                        user={value}
                        onAddUser={onAddUser}
                        onRemoveUser={onRemoveUser}
                        onUpdateUser={onUpdateUser}
                        documentCopy={documentCopy}
                      />
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="search">
            <div className="flex flex-col gap-y-2">
              <label className="text-sm">{t('label')}</label>
              <div className="grid w-full grid-cols-[1fr_max-content_max-content] gap-x-2">
                <Input
                  name="email"
                  id="email"
                  className="dark:bg-neutral-900"
                  placeholder="name@company.com"
                  onChange={e => setSearch(e.target.value)}
                />
                <Button className="h-full" onClick={onSearch}>
                  <Search />
                </Button>
              </div>
              <div className="flex w-full flex-col gap-y-2">
                <label className="text-sm">{searchResult.length ? t('foundYourRequest') : t('noUsersFound')}</label>
                {searchResult.map(value => (
                  <EditorItem
                    key={value.id}
                    user={value}
                    onAddUser={onAddUser}
                    onRemoveUser={onRemoveUser}
                    onUpdateUser={onUpdateUser}
                    documentCopy={documentCopy}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="teams">
            {teams?.map((team: any) => (
              <div key={team.id} className="flex justify-between">
                {team.name}
                <div>
                  {documentCopy?.teams?.includes(team.id) ? (
                    <Button onClick={() => onRemoveTeam(team.id)} className="h-6" variant="destructive">
                      {t('remove')}
                    </Button>
                  ) : (
                    <Button onClick={() => onAddTeam(team.id)} className="h-6" variant="secondary">
                      {t('add')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
