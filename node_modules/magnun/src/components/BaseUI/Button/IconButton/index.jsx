import React from 'react'
import Tooltip from '../../Tooltip'
import styles from './IconButton.module.scss'

export default function IconButton({
  icon,
  label = '',
  appearance = '',
  tooltip,
  tooltipPosition = '',
  shape = '',
  isDisabled = false,
  onClick,
  className = '',
  size = '',
}) {
  const buttonClasses = `${styles['icon-button-container__button']} ${styles[`icon-button-container__button--${appearance || 'default'}`]} ${shape && styles['icon-button-container__button--circle']} ${className && className} ${size && styles[`icon-button-container__button--${size}`]}`

  const button = (
    <button
      disabled={isDisabled}
      className={buttonClasses}
      aria-label={label}
      onClick={onClick}
    >
      {icon}
    </button>
  )

  return (
    <div className={styles['icon-button-container']}>
      {tooltip ? (
        <Tooltip content={tooltip} position={tooltipPosition}>
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </div>
  )
}
