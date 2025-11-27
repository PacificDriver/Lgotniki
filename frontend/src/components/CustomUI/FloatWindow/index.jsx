import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import styles from './FloatWindow.module.scss'

const FloatWindow = ({ triggerRef, children, className, placement = '' }) => {
  const [position, setPosition] = useState({
    top: -10000,
    left: -10000,
    width: triggerRef?.current?.clientWidth,
  })
  const floatWindowRef = useRef(null)

  useEffect(() => {
    const handleScrollOrResize = () => {
      refreshPosition()
    }

    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)

    refreshPosition()

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [])

  const refreshPosition = () => {
    if (!floatWindowRef.current || !triggerRef?.current) return

    const floatWindowHeight = floatWindowRef.current.offsetHeight
    const floatWindowWidth = floatWindowRef.current.offsetWidth
    setPosition(
      calculatePosition(triggerRef.current, floatWindowHeight, floatWindowWidth)
    )
  }

  const calculatePosition = (triggerElement, windowHeight, windowWidth) => {
    const rect = triggerElement.getBoundingClientRect()
    const direction = positionInViewport(rect, windowHeight)
    return setPositionStyle(rect, direction, windowHeight, windowWidth)
  }

  const positionInViewport = (rect, windowHeight) => {
    const viewportHeight = window.innerHeight

    if (rect.bottom + windowHeight >= viewportHeight) {
      return 'top'
    }

    return 'bottom'
  }

  const setPositionStyle = (rect, direction, windowHeight) => {
    if (!floatWindowRef.current) return {}

    const elementWidth = floatWindowRef.current.firstChild.offsetWidth
    const viewportWidth = window.innerWidth

    const fitsOnRight = rect.left + elementWidth <= viewportWidth

    let adjustedLeft

    if (placement === 'right') {
      adjustedLeft = rect.right - elementWidth + window.scrollX
    } else if (placement === 'left') {
      adjustedLeft = rect.left + window.scrollX
    } else {
      adjustedLeft = fitsOnRight
        ? rect.left + window.scrollX
        : Math.max(rect.right + window.scrollX - elementWidth, 0)
    }

    const adjustedTop =
      direction === 'top'
        ? rect.top + window.scrollY - windowHeight - 8
        : rect.bottom + window.scrollY + 8

    return {
      left: adjustedLeft,
      top: adjustedTop,
      width: elementWidth,
      overflow: 'inherit',
    }
  }

  const floatWindow = (
    <div
      ref={floatWindowRef}
      className={`${styles['float-window']} ${className !== undefined && className}`}
      style={position}
    >
      {children}
    </div>
  )

  return ReactDOM.createPortal(floatWindow, document.body)
}

export default FloatWindow
