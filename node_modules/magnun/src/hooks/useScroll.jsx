import { useState, useEffect } from 'react'
import useDebounce from './useDebounce'

function useScroll() {
  const [scrollPosition, setScrollPosition] = useState({ top: 0, left: 0 })
  const debouncedScrollPosition = useDebounce(scrollPosition, 200) // Usando debounce de 200ms

  useEffect(() => {
    const handleScroll = event => {
      const target = event.target
      const scrollTop = target.scrollTop || window.scrollY || 0
      const scrollLeft = target.scrollLeft || window.scrollX || 0

      setScrollPosition({
        top: scrollTop,
        left: scrollLeft,
      })
    }

    document.addEventListener('scroll', handleScroll, true)

    return () => {
      document.removeEventListener('scroll', handleScroll, true)
    }
  }, [])

  return debouncedScrollPosition
}

export default useScroll
