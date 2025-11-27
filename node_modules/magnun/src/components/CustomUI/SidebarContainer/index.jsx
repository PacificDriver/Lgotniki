import React from 'react'

import styles from './SidebarContainer.module.scss'

export default function SidebarContainer({ children, show, title, onClose }) {
  return (
    <div
      className={`${styles['side-container']} ${show ? styles['side-container--opened'] : ''}`}
    >
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className={`${styles['side-container--title']}`}>{title}</div>
        <div className="d-flex justify-content-end">
          <span
            className="material-symbols-outlined u-pointer size-20"
            onClick={onClose}
          >
            close
          </span>
        </div>
      </div>

      <>{children}</>
    </div>
  )
}
