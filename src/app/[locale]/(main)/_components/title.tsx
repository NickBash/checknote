'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import useDebounce from '@/hooks/use-debounce'
import { useDocuments, type DocumentCopy } from '@/stores'
import { useEffect, useRef, useState } from 'react'

interface TitleProps {
  initialData: DocumentCopy
}

export const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const requestUpdateDocument = useDocuments(state => state.requestUpdateDocument)

  const [title, setTitle] = useState(initialData.title || 'Untitled')
  const [isEditing, setIsEditing] = useState(false)

  const debouncedInput = useDebounce(title, 700)

  const isInit = useRef(true)

  useEffect(() => {
    if (isInit.current) {
      isInit.current = false
      return
    }

    requestUpdateDocument(initialData.id, { title: title || 'Untitled' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput])

  const enableInput = () => {
    setTitle(initialData.title)
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const disableInput = () => {
    setIsEditing(false)
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      disableInput()
    }
  }

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button onClick={enableInput} variant="ghost" size="sm" className="h-auto p-1 font-normal">
          <span className="truncate">{initialData?.title}</span>
        </Button>
      )}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-9 w-20 rounded-md" />
}
