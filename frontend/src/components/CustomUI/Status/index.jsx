import React from 'react'

import './style.scss'

export default function Status(props) {
  const icons = {
    error: 'close',
    pending: 'exclamation',
    success: 'check',
  }
  return (
    <div className="status-container">
      <div className={`status-container__content ${props.type}`}>
        <span className="material-symbols-outlined icon__status">
          {icons[props.type]}
        </span>
      </div>
    </div>
  )
}
