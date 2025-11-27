import React from 'react'

export default function Container({ children, display, className, gap }) {
  return (
    <div
      className={`${display ? `${display}-container` : 'grid-container'} ${className}`}
      style={{
        ...(gap !== undefined && { columnGap: `${gap}px`, rowGap: `${gap}px` }),
      }}
    >
      {children}
    </div>
  )
}
