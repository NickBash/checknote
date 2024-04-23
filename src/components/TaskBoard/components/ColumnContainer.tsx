import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MoreHorizontal, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Column, Id, Task } from '../types'
import TaskCard from './TaskCard'

interface Props {
  column: Column
  deleteColumn: (id: Id) => void
  updateColumn: (id: Id, title: string) => void

  createTask: (columnId: Id) => void
  updateTask: (id: Id, content: string) => void
  deleteTask: (id: Id) => void
  tasks: Task[]
}

function ColumnContainer({ column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask }: Props) {
  const [editMode, setEditMode] = useState(false)

  const tasksIds = useMemo(() => {
    return tasks.map(task => task.id)
  }, [tasks])

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: editMode,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
      flex
      max-h-[500px]
      w-[350px]
      flex-col
      rounded-md
      bg-secondary
      opacity-40
      "
      ></div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
  flex
  max-h-[500px]
  w-[350px]
  flex-col
  rounded-sm
  bg-secondary
  shadow-md
  shadow-gray-300
  "
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true)
        }}
        className="
      text-md
      flex
      h-[60px]
      cursor-grab
      items-center
      justify-between
      p-3
      font-bold
      "
      >
        <div className="flex gap-2">
          {!editMode && column.title}
          {editMode && (
            <input
              className="rounded border bg-black px-2 outline-none focus:border-rose-500"
              value={column.title}
              onChange={e => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false)
              }}
              onKeyDown={e => {
                if (e.key !== 'Enter') return
                setEditMode(false)
              }}
            />
          )}
        </div>
        <div>
          <MoreHorizontal className="text-gray-400" size="18" />
        </div>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 overflow-y-auto overflow-x-hidden p-2">
        <SortableContext items={tasksIds}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className="flex items-center gap-2 rounded-md p-4 text-sm text-gray-400 transition hover:text-gray-600 active:text-gray-400"
        onClick={() => {
          createTask(column.id)
        }}
      >
        <Plus size="18" />
        Add task
      </button>
    </div>
  )
}

export default ColumnContainer
