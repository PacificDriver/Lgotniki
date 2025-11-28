import React, { useRef } from 'react'

import styles from './SidebarContainer.module.scss'

export default function SidebarContainer({ children, show, title, onClose }) {
  const sidebarRef = useRef(null)

  const handleBackdropClick = e => {
    // Close sidebar only if click is on the backdrop, not on the sidebar content
    if (onClose && e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!show) return null

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={styles['side-container-backdrop']}
        onClick={handleBackdropClick}
      />
      {/* Sidebar content */}
      <div
        ref={sidebarRef}
        className={`${styles['side-container']} ${show ? styles['side-container--opened'] : ''}`}
        onClick={e => e.stopPropagation()}
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
    </>
  )
}
