import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronDown, ChevronUp, ChevronsUp, GripVertical, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import { Id, Task } from '../types'
import SheetTaskCard from './SheetTaskCard'

interface Props {
  task: Task
  deleteTask: (id: Id) => void
  updateTask: (id: Id, content: Partial<Task>) => void
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false)
  const [editMode, setEditMode] = useState(false)

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

  const priorityIcon: Record<string, JSX.Element> = {
    highest: <ChevronsUp size="20" className="text-red-600" />,
    hight: <ChevronUp size="20" className="text-orange-600" />,
    normal: <ChevronUp size="20" className="text-blue-600" />,
    low: <ChevronDown size="20" className="text-green-600" />,
  }

  const getPriorityIcon = (value: string) => (value in priorityIcon ? priorityIcon[value] : priorityIcon.normal)

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        border-1
      relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-sm border-slate-300 bg-slate-300 p-2.5  text-left opacity-30 dark:bg-slate-700
      "
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task group relative grid h-[100px] min-h-[100px] select-none grid-cols-[min-content_1fr] overflow-hidden rounded-sm bg-white text-left shadow-sm shadow-gray-700 dark:bg-neutral-900 dark:shadow-none"
    >
      <div className="flex h-full w-0 items-center bg-slate-200 transition-all group-hover:w-4 dark:bg-slate-700">
        <GripVertical className="cursor-grab focus:outline-none" {...attributes} {...listeners} size="18" />
      </div>
      <div className="flex-grow-0 p-2">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center font-medium text-gray-500 dark:text-gray-300">
            <span>{task?.titleCard}</span>
          </div>
          <div className="flex cursor-pointer gap-x-2 text-gray-400 dark:text-gray-500">
            {getPriorityIcon(task.priority)}
            <SheetTaskCard task={task} updateTask={updateTask} />
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
          className="!my-0 h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap text-gray-600 dark:text-gray-400"
        >
          {task?.title}
        </p>
      </div>
    </div>
  )
}

export default TaskCard
