import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MoreVertical, Trash } from 'lucide-react'
import { useState } from 'react'
import { Id, Task } from '../types'

interface Props {
  task: Task
  deleteTask: (id: Id) => void
  updateTask: (id: Id, content: string) => void
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false)
  const [editMode, setEditMode] = useState(true)

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
        relative
      flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl border-2 border-rose-500 bg-white p-2.5  text-left opacity-30
      "
      />
    )
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-sm bg-white p-2.5 text-left hover:shadow-md hover:ring-2 hover:ring-inset"
      >
        <p>HELLO</p>
        <textarea
          className="
        h-[90%]
        w-full resize-none rounded border-none bg-transparent focus:outline-none
        "
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.shiftKey) {
              toggleEditMode()
            }
          }}
          onChange={e => updateTask(task.id, e.target.value)}
        />
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="task relative flex h-[100px] min-h-[100px] cursor-grab flex-col rounded-sm bg-white p-2.5 text-left"
      onMouseEnter={() => {
        setMouseIsOver(true)
      }}
      onMouseLeave={() => {
        setMouseIsOver(false)
      }}
    >
      <div className="flex h-6 w-full items-center justify-between">
        <span>Num task</span>
        <div className="cursor-pointer rounded-sm p-1 hover:bg-secondary">
          <MoreVertical size="18" />
        </div>
      </div>
      <p className="!my-0">HELLO</p>
      <p className="!my-0 h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">{task.content}</p>

      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id)
          }}
          className="bg-columnBackgroundColor absolute right-4 top-1/2 -translate-y-1/2 rounded stroke-white p-2 opacity-60 hover:opacity-100"
        >
          <Trash />
        </button>
      )}
    </div>
  )
}

export default TaskCard
