'use client';

import { useEffect, useState } from 'react';
import { CoverImageModal } from './cover-image-modal';
import { SettingsModal } from './settings.modal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SettingsModal />
      <CoverImageModal />
    </>
  );
};
