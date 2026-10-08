'use client'

import {
  createContext,
  useState,
  type ReactNode,
} from 'react'

type StyleCache = {
  id: string
}

const StyleCacheContext = createContext<StyleCache | null>(null)

function createStyleCache(): StyleCache {
  return {
    id: `sc-${Math.random().toString(36).slice(2, 10)}`,
  }
}

export function StyleProvider({ children }: { children: ReactNode }) {
  const [cache] = useState(() => createStyleCache())

  return (
    <StyleCacheContext.Provider value={cache}>
      <meta name="x-style-cache" content={cache.id} />
      {children}
    </StyleCacheContext.Provider>
  )
}
