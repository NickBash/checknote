'use client'

import { useSettings } from '@/hooks/use-settings'
import ModeToggle from '../mode-toggle'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'

export const SettingsModal = () => {
  const isOpenModal = useSettings(state => state.isOpen)
  const onCloseModal = useSettings(state => state.onClose)

  return (
    <Dialog open={isOpenModal} onOpenChange={onCloseModal}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <label>Apperance</label>
            <span className="text-[0.8rem] text-muted-foreground">Customize how Checknote looks on your device</span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  )
}
