import { WebSocketStatus } from '@hocuspocus/provider'
import { EditorUser } from '../types'
import { EditorInfo } from './EditorInfo'

export type EditorHeaderProps = {
  isSidebarOpen?: boolean
  toggleSidebar?: () => void
  characters: number
  words: number
  collabState: WebSocketStatus
  users: EditorUser[]
}

export const EditorHeader = ({ characters, collabState, users, words }: EditorHeaderProps) => {
  return (
    <div className="flex flex-none flex-row items-center justify-between border-b border-neutral-200 bg-white py-2 pl-6 pr-3 text-black dark:border-neutral-800 dark:bg-black dark:text-white">
      <div className="flex flex-row items-center gap-x-1.5"></div>
      <EditorInfo characters={characters} words={words} collabState={collabState} users={users} />
    </div>
  )
}
