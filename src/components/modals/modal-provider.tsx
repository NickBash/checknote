'use client'

import { useEffect, useState } from 'react'
import { CoverImageModal } from './cover-image-modal'
import { EditorsModal } from './editors-modal'

export const ModalProvider = ({ locale }: { locale: string }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* <SettingsModal locale={locale} /> */}
      <CoverImageModal />
      <EditorsModal />
    </>
  )
}
