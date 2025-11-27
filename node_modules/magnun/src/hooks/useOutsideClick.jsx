import { useEffect } from 'react'

const useOutsideClick = (mainRef, handler, ignoreRefs = []) => {
  useEffect(() => {
    const listener = event => {
      if (
        !mainRef.current ||
        mainRef.current.contains(event.target) ||
        ignoreRefs.some(
          ref => ref.current && ref.current.contains(event.target)
        )
      ) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [mainRef, handler, ignoreRefs])
}

export default useOutsideClick
