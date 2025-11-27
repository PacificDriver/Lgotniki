import React from 'react'

import { FaArrowUp, FaArrowDown } from 'react-icons/fa'

import styles from './ChangeIndicator.module.scss'

const ChangeIndicator = ({ value, change, compact = false }) => {
  const isPositive = change >= 0

  return (
    <div
      className={`${styles['change-indicator']} ${!isPositive && styles['change-indicator__negative']} ${compact && styles['change-indicator__compact']}`}
    >
      <div
        className={`${styles['change-indicator__icon']} ${compact && styles['change-indicator__icon__compact']}`}
      >
        {isPositive ? <FaArrowUp /> : <FaArrowDown />}
      </div>

      <span className={styles['change-indicator__value']}>
        {value?.replace('-', '')}
      </span>
    </div>
  )
}

export default ChangeIndicator
