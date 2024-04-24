import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, MoreVertical } from 'lucide-react'
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
      className="task group relative grid h-[100px] min-h-[100px] grid-cols-[min-content_1fr] rounded-sm bg-white text-left shadow-sm shadow-gray-400"
    >
      <div className="flex h-full w-0 items-center bg-slate-200 transition-all group-hover:w-4">
        <GripVertical className="cursor-grab focus:outline-none" {...attributes} {...listeners} size="18" />
      </div>
      <div className="flex-grow-0 p-2">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center font-medium text-gray-500">
            <span>{task?.titleCard}</span>
          </div>
          <div className="flex cursor-pointer gap-x-2 text-gray-400">
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
          className="!my-0 h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap text-gray-600"
        >
          {task?.title}
        </p>
      </div>
    </div>
  )
}

export default TaskCard
