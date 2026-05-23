import { useState, useEffect, useRef, useCallback } from 'react'

export function useLocalStorage(key: string, initialValue: string) {
  const [value, setValue] = useState<string>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ?? initialValue
    } catch {
      return initialValue
    }
  })

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, value)
      } catch {
        // storage full or disabled
      }
    }, 1000)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [key, value])

  const update = useCallback((v: string) => setValue(v), [])

  return [value, update] as const
}
