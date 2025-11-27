import React from 'react'

import styles from './Content.module.scss'

export default function Content({ title, children }) {
  return (
    <div className={styles['content-container']}>
      <div className={styles['logo']}>
        <img src={require('../../../assets/logos/logo-1.png')} alt="Magnun" />
      </div>

      <div className={styles['content-container__content']}>
        <div className={styles['title']}>
          <span>{title}</span>
        </div>

        {children}
      </div>
    </div>
  )
}
