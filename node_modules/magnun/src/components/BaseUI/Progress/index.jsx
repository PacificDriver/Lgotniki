import React from 'react'

import styles from './Progress.module.scss'
import { useFormatValue } from '../../../hooks/useFormatValue'

export default function Progress({
  progress,
  maxValue,
  color,
  height,
  showProgressLabel = false,
  showProgress = false,
  label = '',
  precision = 0,
  className = '',
}) {
  const calculatePercentage = () =>
    `${Math.min(100, parseInt((progress / (maxValue ? maxValue : 100)) * 100))}%`
  const formatValue = useFormatValue

  return (
    <div
      className={`${styles['progress-container']} ${label && styles['progress-container__flex-column']} ${className && className}`}
    >
      {label && <div>{label}</div>}

      <div
        className={`${styles['progress-container__bar']}`}
        style={{ height: height }}
      >
        <div
          className={`${styles['bar-line']} ${progress > 99 ? styles['bar-radius'] : ''}`}
          style={{
            width: calculatePercentage(),
            backgroundColor: color || '#005FED',
            height: height,
          }}
        >
          {showProgressLabel && progress > 2 && (
            <span
              className={`${styles['bar-line--label']}`}
              style={{ fontSize: height ? `calc(${height}px - 3px)` : '8px' }}
            >
              {progress}%
            </span>
          )}
        </div>
      </div>

      {(showProgress || label) && (
        <div className={label && styles['progress-container__percentage']}>
          {formatValue(progress, 'percentage', precision)}
        </div>
      )}
    </div>
  )
}
