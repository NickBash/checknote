'use client'

import { format, type Locale } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { Calendar } from '@/components/ui/Calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type Props = {
  date: Date | undefined
  setDate: (value: Date | undefined) => void
  locale: Locale
}

export function DatePicker({ date, setDate, locale }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="pointer-events-auto w-auto p-0">
        <Calendar locale={locale} mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
