import useDebounce from '@/hooks/use-debounce'
import { useUserStore } from '@/stores'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { NodeViewWrapper } from '@tiptap/react'
import { Plus } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ColumnContainer from './components/ColumnContainer'
import TaskCard from './components/TaskCard'
import type { Column, Id, Task } from './types'

const defaultCols: Column[] = [
  {
    id: 'todo',
    title: 'Todo',
  },
  {
    id: 'doing',
    title: 'Work in progress',
  },
  {
    id: 'done',
    title: 'Done',
  },
]

export const TaskBoard = (props: any) => {
  const initComponent = useRef(false)

  const user = useUserStore(state => state.user)

  const [columns, setColumns] = useState<Column[]>([])
  const columnsId = useMemo(() => columns.map(col => col.id), [columns])

  const [tasks, setTasks] = useState<Task[]>([])

  const [activeColumn, setActiveColumn] = useState<Column | null>(null)

  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const debouncedTasks = useDebounce(tasks, 1400)
  const debouncedColumns = useDebounce(columns, 300)

  const updateTasks = () => {
    if (props) {
      setTimeout(() => {
        props.updateAttributes({
          tasks: JSON.stringify(tasks),
        })
      })
    }
  }

  const updateColumns = () => {
    if (props) {
      setTimeout(() => {
        props.updateAttributes({
          columns: JSON.stringify(columns),
        })
      })
    }
  }

  useEffect(() => {
    if (initComponent.current) {
      updateTasks()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTasks])

  useEffect(() => {
    if (initComponent.current) {
      updateColumns()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedColumns])

  useEffect(() => {
    if (props) {
      if (!initComponent.current) {
        initComponent.current = true
      }

      if (props.node.attrs.tasks !== JSON.stringify(tasks)) {
        console.log('TASKS НЕ РАВНО!')
        setTasks(JSON.parse(props.node.attrs.tasks))
      }

      if (props.node.attrs.columns !== JSON.stringify(columns)) {
        console.log('COLUMNS НЕ РАВНО!')
        setColumns(JSON.parse(props.node.attrs.columns))
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  )

  return (
    <NodeViewWrapper className="react-component">
      <div
        className="
        m-auto
        flex
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        py-1
    "
      >
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
          <div className="flex gap-4">
            <div className="flex gap-4">
              <SortableContext items={columnsId}>
                {columns.map(col => (
                  <ColumnContainer
                    key={col.id}
                    column={col}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    tasks={tasks.filter(task => task.columnId === col.id)}
                  />
                ))}
              </SortableContext>
            </div>
            <button
              onClick={() => {
                createNewColumn()
              }}
              className="
      flex
      h-[40px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      items-center
      gap-2
      rounded-sm
      bg-secondary
      px-4
      text-sm
      text-gray-400
      shadow-sm
      shadow-gray-300
      transition
      hover:text-gray-600 active:text-gray-400
      "
            >
              <Plus size="18" />
              Add Column
            </button>
          </div>

          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter(task => task.columnId === activeColumn.id)}
                />
              )}
              {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      </div>
    </NodeViewWrapper>
  )

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: nanoid(),
      titleCard: `KK-${tasks.length + 1}`,
      columnId,
      description: `New task content`,
      performers: [],
      priority: 'normal',
      title: 'New tasks',
      beginDate: undefined,
      endDate: undefined,
      creator: user?.name || user?.email,
    }

    setTasks([...tasks, newTask])
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter(task => task.id !== id)
    setTasks(newTasks)
  }

  function updateTask(id: Id, content: Partial<Task>) {
    const newTasks = tasks.map(task => {
      if (task.id !== id) return task
      return { ...task, ...content }
    })

    setTasks(newTasks)
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: nanoid(),
      title: `Column ${columns.length + 1}`,
    }

    setColumns([...columns, columnToAdd])
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter(col => col.id !== id)
    setColumns(filteredColumns)

    const newTasks = tasks.filter(t => t.columnId !== id)
    setTasks(newTasks)
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map(col => {
      if (col.id !== id) return col
      return { ...col, title }
    })

    setColumns(newColumns)
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column)
      return
    }

    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task)
      return
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null)
    setActiveTask(null)

    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveAColumn = active.data.current?.type === 'Column'
    if (!isActiveAColumn) return

    setColumns(columns => {
      const activeColumnIndex = columns.findIndex(col => col.id === activeId)

      const overColumnIndex = columns.findIndex(col => col.id === overId)

      return arrayMove(columns, activeColumnIndex, overColumnIndex)
    })
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === 'Task'
    const isOverATask = over.data.current?.type === 'Task'

    if (!isActiveATask) return

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId)
        const overIndex = tasks.findIndex(t => t.id === overId)

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId
          return arrayMove(tasks, activeIndex, overIndex - 1)
        }

        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverAColumn = over.data.current?.type === 'Column'

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId)

        tasks[activeIndex].columnId = overId
        return arrayMove(tasks, activeIndex, activeIndex)
      })
    }
  }
}

export default TaskBoard
