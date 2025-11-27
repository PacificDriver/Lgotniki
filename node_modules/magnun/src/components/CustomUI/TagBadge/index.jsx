import React from 'react'

import './style.scss'

export default function TagBadge({ content, color, children }) {
  return (
    <div className={`tag-badge-container ${color}`}>
      {children ? children : content}
    </div>
  )
}
