import { Textarea } from '@/components/ui-tiptap/Textarea'
import { DatePicker } from '@/components/ui/DatePicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { UserDB } from '@/stores'
import { enUS, ru } from 'date-fns/locale'
import { Check, ChevronDown, ChevronUp, ChevronsUp, ChevronsUpDown, Pencil } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import type { Id, Task } from '../types'

interface Props {
  task: Task
  updateTask: (id: Id, content: Partial<Task>) => void
  usersList: UserDB[]
}

function SheetTaskCard({ task, updateTask, usersList }: Props) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<UserDB | null>(null)

  const params = useParams()

  const locale = useMemo(() => (params.locale === 'ru' ? ru : enUS), [params])

  const [beginDate, setBeginDate] = useState<Date | undefined>(task?.beginDate)
  const [endDate, setEndDate] = useState<Date | undefined>(task?.endDate)

  const updateBeginData = (value: Date | undefined) => {
    setBeginDate(value)
    updateTask(task.id, { beginDate })
  }

  const updateEndData = (value: Date | undefined) => {
    setEndDate(value)
    updateTask(task.id, { endDate })
  }

  useEffect(() => {
    if (usersList?.length && task) {
      const currUser = usersList?.find(user => user?.id && user?.id === task?.performers)

      if (currUser) {
        setValue(currUser)
      }
    }
  }, [task, usersList])

  useEffect(() => {
    updateTask(task?.id, { performers: value?.id })
  }, [value])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Pencil size="22" className="rounded-sm p-1 hover:bg-secondary" />
      </SheetTrigger>
      <SheetContent onMouseMoveCapture={e => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Задача {task?.titleCard}</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="name">Заголовок</Label>
            <Input
              value={task?.title}
              onChange={e => updateTask(task?.id, { title: e.target.value })}
              id="name"
              className="focus-visible:ring-transparent"
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="description">Описание задачи</Label>
            <Textarea
              value={task?.description}
              onChange={e => updateTask(task?.id, { description: e.target.value })}
              id="description"
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label>Приоритет</Label>
            <Select value={task?.priority} onValueChange={e => updateTask(task?.id, { priority: e })}>
              <SelectTrigger className="focus:ring-transparent">
                <SelectValue placeholder="Выберите приоритет" />
              </SelectTrigger>
              <SelectContent className="pointer-events-auto z-[51]">
                <SelectItem value="highest">
                  <div className="flex flex-row items-center gap-x-1">
                    <ChevronsUp size="20" className="text-red-600" />
                    highest
                  </div>
                </SelectItem>
                <SelectItem value="hight">
                  <div className="flex flex-row items-center gap-x-1">
                    <ChevronUp size="20" className="text-orange-600" />
                    hight
                  </div>
                </SelectItem>
                <SelectItem value="normal">
                  <div className="flex flex-row items-center gap-x-1">
                    <ChevronUp size="20" className="text-blue-600" />
                    normal
                  </div>
                </SelectItem>
                <SelectItem value="low">
                  <div className="flex flex-row items-center gap-x-1">
                    <ChevronDown size="20" className="text-green-600" />
                    low
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="performers">Исполнители</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
                  {value ? value?.username : 'Выберите исполнителя'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="pointer-events-auto max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {usersList?.map(user => (
                        <CommandItem
                          key={user?.id}
                          value={user?.username}
                          onSelect={currentValue => {
                            setValue(user)
                            setOpen(false)
                          }}
                        >
                          <Check className={cn('mr-2 h-4 w-4', value?.id === user?.id ? 'opacity-100' : 'opacity-0')} />
                          {user?.username}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-4">
            <Label>Дата начала выполнения</Label>
            <DatePicker locale={locale} date={beginDate} setDate={updateBeginData} />
          </div>
          <div className="flex flex-col gap-4">
            <Label>Дата завершения выполнения</Label>
            <DatePicker locale={locale} date={endDate} setDate={updateEndData} />
          </div>
        </div>
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Сохранить изменения</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  )
}

export default SheetTaskCard
