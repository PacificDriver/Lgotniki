import React, { useState } from 'react'

import styles from './Alert.module.scss'

export default function Alert({ children, className, type, dismiss, onClose }) {
  const [activeAlert, setActiveAlert] = useState(true)

  const handleCloseAlert = () => {
    setActiveAlert(!activeAlert)
    onClose?.()
  }

  return (
    <div className={styles['alert-container']}>
      {activeAlert && (
        <div
          className={`${styles['alert-container__content']} alert-container__content--${styles[type]} ${className}`}
        >
          <span className={styles['alert-container__content--children']}>
            {children}
          </span>
          {dismiss && (
            <span
              className={`material-symbols-outlined ${styles['alert-container__content--close']}`}
              onClick={handleCloseAlert}
            >
              close
            </span>
          )}
        </div>
      )}
    </div>
  )
}
