import { useEffect, useState } from 'react'

function useScreenSize() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024
  const isDesktop = width >= 1024

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
  }
}

export default useScreenSize
