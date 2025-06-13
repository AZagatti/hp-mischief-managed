import { useRef, useEffect, useCallback } from 'react'

type AnyFunction = (...args: any[]) => any

export function useDebouncedCallback<T extends AnyFunction>(
  callback: T,
  delay: number = 500,
) {
  const callbackRef = useRef<T>(callback)
  const timeoutRef = useRef<NodeJS.Timeout>(undefined)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay],
  )
}
