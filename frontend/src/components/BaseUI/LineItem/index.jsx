import React from 'react'

export default function LineItem({ children, width, className }) {
  return (
    <div
      className={`line-item-container ${className}`}
      style={{ minWidth: width, width }}
    >
      {children}
    </div>
  )
}
