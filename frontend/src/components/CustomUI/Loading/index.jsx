import React from 'react'

import styles from './Loading.module.scss'

export default function Loading() {
  return (
    <div className={styles['loading-container']}>
      <svg
        width="300"
        height="100"
        viewBox="0 0 300 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="10"
          y="50"
          className={styles['loading-container__letter']}
          style={{ animationDelay: '0s' }}
        >
          M
        </text>
        <text
          x="60"
          y="50"
          className={styles['loading-container__letter']}
          style={{ animationDelay: '0.2s' }}
        >
          A
        </text>
        <text
          x="110"
          y="50"
          className={styles['loading-container__letter']}
          style={{ animationDelay: '0.4s' }}
        >
          G
        </text>
        <text
          x="160"
          y="50"
          className={styles['loading-container__letter']}
          style={{ animationDelay: '0.6s' }}
        >
          N
        </text>
        <text
          x="210"
          y="50"
          className={styles['loading-container__letter']}
          style={{ animationDelay: '0.8s' }}
        >
          U
        </text>
        <text
          x="260"
          y="50"
          className={styles['loading-container__letter']}
          style={{ animationDelay: '1s' }}
        >
          N
        </text>
      </svg>
    </div>
  )
}
