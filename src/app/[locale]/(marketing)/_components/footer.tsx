import { Button } from '@/components/ui/button'

export const Footer = () => {
  return (
    <div className="z-50 flex w-full items-center p-1">
      <div className="flex w-full items-center justify-between gap-x-2 text-muted-foreground md:ml-auto md:justify-end">
        <Button variant="ghost" size="sm">
          Privacy Policy
        </Button>
      </div>
    </div>
  )
}
