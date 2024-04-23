import { Textarea } from '@/components/ui-tiptap/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, ChevronsUpDown, MoreVertical, Pencil } from 'lucide-react'
import { useState } from 'react'
import { Id, Task } from '../types'

interface Props {
  task: Task
  deleteTask: (id: Id) => void
  updateTask: (id: Id, content: Partial<Task>) => void
}

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
]

function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: editMode,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const toggleEditMode = () => {
    setEditMode(prev => !prev)
    setMouseIsOver(false)
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        border-1
      relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-sm border-slate-300 bg-slate-300 p-2.5  text-left opacity-30
      "
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task relative flex h-[100px] min-h-[100px] flex-col gap-y-1 rounded-sm bg-white p-2.5 text-left shadow-sm shadow-gray-400"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center font-medium text-gray-500">
          <span>{task?.titleCard}</span>
        </div>
        <div className="flex cursor-pointer gap-x-2 text-gray-400">
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
                    onChange={e => updateTask(task.id, { title: e.target.value })}
                    id="name"
                    className="focus-visible:ring-transparent"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Label htmlFor="description">Описание задачи</Label>
                  <Textarea
                    value={task?.description}
                    onChange={e => updateTask(task.id, { description: e.target.value })}
                    id="description"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Label>Приоритет</Label>
                  <Select value={task?.priority} onValueChange={e => updateTask(task.id, { priority: e })}>
                    <SelectTrigger className="focus:ring-transparent">
                      <SelectValue placeholder="Выберите приоритет" />
                    </SelectTrigger>
                    <SelectContent className="z-[99999]">
                      <SelectItem value="hight">hight</SelectItem>
                      <SelectItem value="normal">normal</SelectItem>
                      <SelectItem value="low">low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-4">
                  <Label htmlFor="performers">Исполнители</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
                        {value
                          ? frameworks.find(framework => framework.value === value)?.label
                          : 'Выберите исполнителей'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search framework..." />
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                          {frameworks.map(framework => (
                            <CommandItem
                              key={framework.value}
                              value={framework.value}
                              onSelect={currentValue => {
                                setValue(currentValue === value ? '' : currentValue)
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn('mr-2 h-4 w-4', value === framework.value ? 'opacity-100' : 'opacity-0')}
                              />
                              {framework.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Сохранить изменения</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="rounded-sm p-1 hover:bg-secondary" size="22" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => deleteTask(task.id)}>Удалить</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p
        onClick={toggleEditMode}
        className="!my-0 h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap text-gray-600"
      >
        {task?.description}
      </p>
    </div>
  )
}

export default TaskCard
