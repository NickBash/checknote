import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import { Id, Task } from '../types'

interface Props {
  task: Task
  deleteTask: (id: Id) => void
  updateTask: (id: Id, content: string) => void
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

  // if (editMode) {
  //   return (
  //     <div
  //       ref={setNodeRef}
  //       style={style}
  //       {...attributes}
  //       {...listeners}
  //       className="relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-sm bg-white p-2.5 text-left hover:shadow-md hover:ring-2 hover:ring-inset"
  //     >
  //       <textarea
  //         className="
  //       h-[90%]
  //       w-full resize-none rounded border-none bg-transparent focus:outline-none
  //       "
  //         value={task.content}
  //         placeholder="Task content here"
  //         onBlur={toggleEditMode}
  //         onKeyDown={e => {
  //           if (e.key === 'Enter' && e.shiftKey) {
  //             toggleEditMode()
  //           }
  //         }}
  //         onChange={e => updateTask(task.id, e.target.value)}
  //       />
  //     </div>
  //   )
  // }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task relative flex h-[100px] min-h-[100px] flex-col rounded-sm bg-white p-2.5 text-left shadow-sm shadow-gray-400"
    >
      <div className="flex h-6 w-full items-center justify-between">
        <div className="flex items-center gap-x-2">
          <GripVertical size="18" className="cursor-grab" />
          <span>KK-2000</span>
        </div>
        <div className="cursor-pointer rounded-sm p-1 hover:bg-secondary">
          <MoreVertical size="18" />
        </div>
      </div>
      {editMode ? (
        <textarea
          className="
        h-[90%]
        w-full resize-none rounded border-none bg-transparent focus:outline-none
        "
          value={task.content}
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.shiftKey) {
              toggleEditMode()
            }
          }}
          onChange={e => updateTask(task.id, e.target.value)}
        />
      ) : (
        <p
          onClick={toggleEditMode}
          className="!my-0 h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"
        >
          {task.content}
        </p>
      )}
    </div>
  )
}

export default TaskCard
