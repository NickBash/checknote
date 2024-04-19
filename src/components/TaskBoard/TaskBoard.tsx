import { NodeViewWrapper } from '@tiptap/react'
import { Button } from '../ui/button'

export const TaskBoard = (props: any) => {
  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1,
    })
  }

  return (
    <NodeViewWrapper className="react-component">
      <span className="label">React Component</span>

      <div className="content">
        <Button onClick={increase}>This button has been clicked {props.node.attrs.count} times.</Button>
      </div>
    </NodeViewWrapper>
  )
}

export default TaskBoard
