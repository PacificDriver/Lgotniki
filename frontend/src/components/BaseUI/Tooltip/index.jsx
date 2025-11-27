import React, { useRef } from 'react'

import styles from './Tooltip.module.scss'

export default function Tooltip({ content, position, customStyle, children }) {
  const tooltipRef = useRef()
  const containerRef = useRef()

  const handleDisplayTooltip = () => {
    tooltipRef.current.style.display = 'block'

    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const spaceRight = window.innerWidth - containerRect.right

    if (['top', 'bottom'].includes(position)) {
      if (
        spaceRight >= tooltipRect.width &&
        containerRect.left - containerRect.width < tooltipRect.width
      )
        tooltipRef.current.style.left = '0'
      if (
        spaceRight <= tooltipRect.width &&
        containerRect.left > tooltipRect.width
      )
        tooltipRef.current.style.right = '0'
    }
  }

  const handleHideTooltip = () => (tooltipRef.current.style.display = 'none')
  return (
    <div
      ref={containerRef}
      className={styles['tooltip-container']}
      onMouseEnter={handleDisplayTooltip}
      onMouseLeave={handleHideTooltip}
    >
      <div className={styles['tooltip-container__content']}>
        {children}

        <span
          ref={tooltipRef}
          className={`${styles['tooltip-container__tooltip']} ${styles[`tooltip-container__tooltip--${position || 'bottom'}`]}`}
          style={customStyle}
        >
          {content}
        </span>
      </div>
    </div>
  )
}
