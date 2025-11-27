import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useTheme } from '../../../hooks/useTheme'

import styles from './Range.module.scss'

export default function Range({
  value: propValue,
  min,
  max,
  step,
  onChange,
  disabled,
  showValue,
}) {
  const inputRef = useRef(null)
  const progressRef = useRef(null)
  const rangeId = `range-${uuidv4()}`

  const [value, setValue] = useState(0)

  const theme = useTheme()

  useEffect(() => {
    if (propValue) setTimeout(() => handleRange(propValue), 0)
  }, [propValue, theme])

  useEffect(() => {
    const handleResize = () => setTimeout(() => handleRange(value), 0)

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [value])

  const handleRange = value => {
    if (!value) return

    setValue(value)
    setOffset(value)
    onChange(value)
  }

  const scale = (value, min, max, outMin, outMax) =>
    ((value - min) * (outMax - outMin)) / (max - min) + outMin

  const setOffset = value => {
    const minValue = min || 0
    const maxValue = max || 100

    const progressFilledArea =
      ((value - minValue) / (maxValue - minValue)) * 100
    const colorAreaFilled = disabled
      ? '#C0C6CF'
      : theme === 'dark'
        ? '#34455F'
        : '#42516D'
    const colorAreaNotFilled = disabled
      ? '#F3F4F6'
      : theme === 'dark'
        ? '#5D6B83'
        : '#DEE0E5'
    const offsetWithValue =
      ((value - minValue) / (maxValue - minValue)) *
        inputRef?.current?.offsetWidth -
      progressRef?.current?.offsetWidth / 2 +
      scale(value, minValue, maxValue, 10, -10)

    const style = inputRef?.current ? inputRef.current.style : undefined

    style.height = '4px'
    style.background = `linear-gradient(to right, ${colorAreaFilled} 0%, ${colorAreaFilled} ${progressFilledArea}%, ${colorAreaNotFilled} ${progressFilledArea - 100}%, ${colorAreaNotFilled} 100%)`

    if (progressRef?.current)
      progressRef.current.style.left = `${offsetWithValue}px`
  }

  return (
    <div className={styles['range-container']}>
      <input
        type="range"
        id={rangeId}
        ref={inputRef}
        className={`${styles['range-container__range']}`}
        value={value || 0}
        min={min}
        max={max}
        step={step}
        onChange={event => handleRange(event.target.value)}
        disabled={disabled}
      />

      {showValue && (
        <div className={styles['range-container__progress']} ref={progressRef}>
          {value}
        </div>
      )}
    </div>
  )
}
