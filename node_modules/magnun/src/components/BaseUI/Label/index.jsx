import React from 'react'

import styles from './Label.module.scss'

export default function Label({ htmlFor, required, children }) {
  return (
    <div className={styles['label-container']}>
      <label htmlFor={htmlFor}>
        {children}
        {required && (
          <span className={styles['label-container--required']}>*</span>
        )}
      </label>
    </div>
  )
}
