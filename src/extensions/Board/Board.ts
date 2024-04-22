import TaskBoard from '@/components/TaskBoard/TaskBoard'
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const Board = Node.create({
  name: 'board',
  group: 'block',
  atom: true,
  selectable: false,
  excludes: '_',
  addAttributes() {
    return {
      tasks: {
        default: JSON.stringify([]),
      },
      columns: {
        default: JSON.stringify([]),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'board',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['board', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(TaskBoard)
  },
})

export default Board