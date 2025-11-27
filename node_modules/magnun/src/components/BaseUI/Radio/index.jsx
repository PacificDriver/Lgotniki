import React, { useRef, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import styles from './Radio.module.scss'

export default function Radio({
  options: items,
  disabled,
  direction,
  selected,
  onChange,
}) {
  const inputRef = useRef(null)

  const [selectedOption, setSelectedOption] = useState(null)
  const [uuid, setUuid] = useState([])
  const [options, setOptions] = useState([])

  useEffect(() => {
    if (!items?.length) return

    const list = []

    for (let index = 0; index < items.length; index++) {
      items[index].disabled = false
      list.push(`radio-${uuidv4()}`)
    }

    setOptions([...items])
    setUuid([...list])
  }, [items])

  useEffect(() => {
    const index = options?.findIndex(option => option.value === selected)

    if (index !== -1) setSelectedOption(index)
  }, [options, selected])

  useEffect(() => {
    items?.forEach(option => {
      if (disabled?.includes(option?.value)) option.disabled = true
    })

    setOptions([...items])
  }, [disabled, items])

  const handleSelection = (index, option) => {
    if (option?.disabled) return

    setSelectedOption(index)
    onChange?.(option?.value)
  }

  return (
    <div
      className={styles['radio-container']}
      style={{
        flexDirection: direction || 'column',
        ...(direction === 'row' && { gap: '16px' }),
      }}
    >
      {options?.map((option, index) => (
        <div
          key={index}
          className={`d-flex align-items-center ${option?.disabled ? styles['radio-container--disabled'] : ''}`}
        >
          <input
            type="radio"
            ref={inputRef}
            id={uuid?.[index] || window.btoa(option?.label)}
            className={styles['radio-container__radio']}
            value={option?.value}
            checked={selectedOption === index}
            onChange={() => handleSelection(index, option)}
            disabled={option?.disabled}
          />

          <label
            className={`${styles['radio-container__label']}`}
            htmlFor={uuid?.[index] || window.btoa(option?.label)}
            onClick={() => handleSelection(index, option)}
          >
            {option?.label}
          </label>
        </div>
      ))}
    </div>
  )
}
