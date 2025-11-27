import React, { useRef, useState, useEffect } from 'react'

import { MdCheckCircle } from 'react-icons/md'
import { MdCancel } from 'react-icons/md'

import styles from './Input.module.scss'

export default function Input({
  type = '',
  placeholder = '',
  value,
  label = '',
  onChange,
  disabled = false,
  onFocused = false,
  min,
  max,
  maxLength,
  required = false,
  valid,
  message = '',
  className = '',
  useBorder = true,
  iconBefore,
  iconAfter,
  clickableIcon = false,
  iconClassName = '',
}) {
  const inputRef = useRef(null)

  const [input, setInput] = useState('')
  const [status, setStatus] = useState({ valid: undefined })

  useEffect(() => {
    if (value) {
      setInput(value)
    }
  }, [value])

  useEffect(() => {
    if (onFocused) {
      setTimeout(() => {
        inputRef?.current?.focus()
      }, 0)
    }
  }, [onFocused])

  useEffect(() => {
    setStatus({
      valid: toBoolean(valid),
    })
  }, [valid])

  const toBoolean = value => {
    if (value === undefined) return undefined
    if (typeof value === 'string') return value?.toLowerCase() === 'true'
    return value
  }

  const onChangeInput = event => {
    onChange?.(event)
    setInput(event.target.value)
  }

  const applyClasses = () => {
    const classes = []

    if (status?.valid !== undefined) {
      if (status?.valid) classes.push('input-container__input--valid')
      else classes.push('input-container__input--invalid')
    }

    if (iconBefore) classes.push('input-container__input--icon-before')
    if (iconAfter) classes.push('input-container__input--icon-after')

    return classes
  }

  const statusClass = () => {
    if (status?.valid !== undefined) {
      if (status?.valid) return 'input-container__message--valid'
      else return 'input-container__message--invalid'
    }

    return
  }

  const onFocus = () => {
    setStatus({
      valid: undefined,
    })
  }

  return (
    <div
      className={`${styles['input-container']} ${!useBorder && styles['input-container--no-border']}`}
    >
      <label htmlFor={inputRef} className={styles['input-container__label']}>
        <span>{label}</span>
        {required && (
          <span className={styles['input-container__label--required']}>*</span>
        )}
      </label>

      <div className="u-relative d-flex align-items-center">
        <input
          className={`${styles['input-container__input']} ${className && className} ${applyClasses()?.length ? styles[applyClasses().join(' ')] : ''}`}
          type={type}
          ref={inputRef}
          value={input}
          onChange={event => onChangeInput(event)}
          disabled={disabled || false}
          placeholder={placeholder}
          min={min}
          max={max}
          maxLength={maxLength}
          onFocus={event => onFocus(event)}
        />

        {(iconBefore || iconAfter) && (
          <span
            className={`${styles['input-icon']} ${iconBefore && styles['input-icon--before']} ${iconAfter && styles['input-icon--after']} ${iconClassName !== undefined && iconClassName}`}
            onClick={() => clickableIcon && setInput('')}
          >
            {iconBefore || iconAfter}
          </span>
        )}

        {status?.valid !== undefined && (
          <span className={styles['input-container__input-icons']}>
            {status?.valid ? (
              <MdCheckCircle
                className={styles['input-container__input-icons--valid']}
              />
            ) : (
              <MdCancel
                className={styles['input-container__input-icons--invalid']}
              />
            )}
          </span>
        )}

        {status?.valid !== undefined && message && (
          <span
            className={`${styles['input-container__message']} ${styles[statusClass()]}`}
          >
            {message || 'Required field'}
          </span>
        )}
      </div>
    </div>
  )
}
