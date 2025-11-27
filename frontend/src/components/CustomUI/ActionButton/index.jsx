import React from 'react'

import styles from './ActionButton.module.scss'

export default function ActionButton({ children, onClick, title, className }) {
  return (
    <div
      className={`${styles['action-button-container']} ${className || ''}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </div>
  )
}
