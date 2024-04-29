import { cn } from '@/lib/utils'
import { Poppins } from 'next/font/google'

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
})

export const Logo = (props: { onClick?: () => void }) => {
  return (
    <div onClick={props.onClick} className="hidden cursor-pointer select-none items-center gap-x-2 md:flex">
      <p className={cn('font-semibold', font.className)}>
        CHECK<span className="text-gray-400">NOTE</span>
      </p>
    </div>
  )
}
