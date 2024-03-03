'use client'
import { createEdgeStoreProvider } from '@edgestore/react'
import { type EdgeStoreRouter } from '../app/[locale]/api/edgestore/[...edgestore]/route'
const { EdgeStoreProvider, useEdgeStore } = createEdgeStoreProvider<EdgeStoreRouter>()
export { EdgeStoreProvider, useEdgeStore }
