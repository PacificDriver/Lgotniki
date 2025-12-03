import React from 'react'

import styles from './Loading.module.scss'

import logoImage from '../../../assets/logos/its-logo.svg'

export default function Loading() {
  return (
    <div className={styles['loading-container']}>
      <img
        src={logoImage}
        alt="ITS"
        className={styles['loading-container__logo']}
      />
    </div>
  )
}
