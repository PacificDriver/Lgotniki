import { useRef, useState } from 'react'

const usePositioner = () => {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const containerRef = useRef(null)
  const targetRef = useRef(null)

  const calculatePosition = event => {
    if (containerRef.current && event) {
      const targetRect = event?.target?.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()

      const spaceRight = window.innerWidth - targetRect.right
      const spaceAbove = targetRect.top
      const spaceBelow = window.innerHeight - targetRect.bottom

      let newPosition = {
        left:
          spaceRight >= containerRect.width
            ? targetRect.left
            : targetRect.right - containerRect.width,
      }

      const containerHeight = containerRect.height

      if (spaceAbove < spaceBelow) {
        newPosition.top = targetRect.bottom + 10
      } else {
        newPosition.top = targetRect.top - containerHeight - 10
      }

      setPosition(newPosition)
    }
  }

  const handlePositioning = event => calculatePosition(event)

  return {
    position,
    containerRef,
    targetRef,
    handlePositioning,
  }
}

export default usePositioner
