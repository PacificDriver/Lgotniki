import React from 'react'

import './style.scss'

export default function Badge({ content, appearance, max, children }) {
  return (
    <div className="badge-container">
      <div className="badge-container__content">
        <div className="d-flex">{children}</div>
        <div
          className={`badge-type badge-type__${appearance || 'default'} ${!content ? 'badge-type--empty' : ''}`}
        >
          {max ? `${max}+` : content}
        </div>
      </div>
    </div>
  )
}
