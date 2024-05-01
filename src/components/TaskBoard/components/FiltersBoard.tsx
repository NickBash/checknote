import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MinusCircle, PlusCircle } from 'lucide-react'
import type { Priority } from '../TaskBoard'

type Props = {
  priority: Priority | null
  setPriority: (value: Priority | null) => void
}

function FilterBoard({ priority, setPriority }: Props) {
  return (
    <div className="flex flex-col gap-y-2" contentEditable={false}>
      <p className="font-medium">Фильтры</p>
      {priority && (
        <div className="flex">
          <div
            onClick={() => setPriority(null)}
            className="flex cursor-pointer select-none items-center gap-x-2 rounded-md bg-black p-2 text-gray-100"
          >
            Приоритет: {priority} <MinusCircle size={18} />
          </div>
        </div>
      )}
      {!priority && (
        <div className="flex flex-row flex-wrap gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex select-none items-center gap-x-2 rounded-md bg-secondary p-2 ring-transparent transition hover:bg-gray-200 focus-visible:ring-transparent">
                Приоритет <PlusCircle size={18} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPriority('highest')}>highest</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriority('high')}>high</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriority('normal')}>normal</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriority('low')}>low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}

export default FilterBoard
