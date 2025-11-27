import React from 'react'

import styles from './Lozenge.module.scss'

export default function Lozenge({ appearance, isBold, isUpper, children }) {
  return (
    <div
      className={`${styles['lozenge-container']} ${styles[`lozenge-container--${appearance || 'default'}`]} ${isBold && styles['lozenge-container--bold']} ${isUpper && styles['lozenge-container--upper']}`}
    >
      {children}
    </div>
  )
}
