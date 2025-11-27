import React, { useEffect, useRef, useState } from 'react'

import useOutsideClick from '../../../hooks/useOutsideClick'

import { MdOutlineCalendarToday } from 'react-icons/md'

import Calendar from '../Calendar'

import './DatePicker.scss'

export default function DatePicker({
  value,
  label,
  placeholder,
  minDate,
  maxDate,
  valid,
  required,
  message,
  onChange,
}) {
  const [state, setState] = useState({
    date: undefined,
    inputDate: '',
    displayCalendar: false,
    valid: undefined,
  })

  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setState({
      ...state,
      date: value,
      inputDate: value !== undefined ? value : '',
      valid: toBoolean(valid),
    })
  }, [valid, value])

  useOutsideClick(containerRef, () => {
    setState({ ...state, displayCalendar: false })
  })

  const formatarData = inputValue => {
    const value = inputValue.replace(/\D/g, '')

    const formattedValue =
      value.length <= 2
        ? value
        : value.length <= 4
          ? `${value.slice(0, 2)}/${value.slice(2)}`
          : `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`

    setState({ ...state, inputDate: formattedValue })
  }

  const handleToggleDropdown = event => {
    if (state?.displayCalendar) {
      return setState({ ...state, displayCalendar: false })
    }

    calculatePosition(event)
    setState({
      ...state,
      displayCalendar: true,
      valid: undefined,
    })
  }

  const calculatePosition = event => {
    if (event) {
      const parentRect = event?.target?.getBoundingClientRect()
      const spaceAbove = parentRect.top
      const spaceBelow = window.innerHeight - parentRect.bottom

      setTimeout(() => {
        if (spaceAbove < spaceBelow) {
          contentRef.current.classList.remove(
            'date-picker-container__selector--dropup'
          )
        } else {
          contentRef.current.classList.add(
            'date-picker-container__selector--dropup'
          )
        }
      }, 1)
    }
  }

  const onBlur = () => {
    setState({ ...state, date: state?.inputDate })
    onChange?.(state?.inputDat)
  }

  const onSelected = value => {
    setState({
      ...state,
      date: value,
      inputDate: value,
      displayCalendar: false,
    })
    onChange?.(value)
  }

  const statusClass = () => {
    if (state?.valid !== undefined) {
      if (state?.valid) return 'content-message--valid'
      else return 'content-message--invalid'
    }

    return
  }

  const toBoolean = value => {
    if (value === undefined) return undefined
    if (typeof value === 'string') return value?.toLowerCase() === 'true'
    return value
  }

  return (
    <div className="date-picker-container" ref={containerRef}>
      <div className="date-picker-container__content">
        <label
          htmlFor={inputRef}
          className="date-picker-container__content--label"
        >
          <span>{label}</span>

          {required && label && (
            <span className="date-picker-container__content--label--required">
              *
            </span>
          )}
        </label>

        <input
          className={`date-picker-container__content--input ${state?.displayCalendar ? 'date-picker-container__content--input--no-focus' : ''} ${state?.valid !== undefined ? (state?.valid ? 'date-picker-container__content--input--valid' : 'date-picker-container__content--input--invalid') : ''}`}
          type="text"
          placeholder={placeholder || 'Select'}
          value={state?.inputDate}
          onChange={event => formatarData(event?.target?.value)}
          onBlur={onBlur}
          ref={inputRef}
        />

        <MdOutlineCalendarToday
          className={`date-picker-container__content--icon ${label === undefined ? 'date-picker-container__content--no-label' : ''}`}
          onClick={event => handleToggleDropdown(event)}
          onMouseOver={() => (inputRef.current.style.borderColor = '#3772ff')}
        />

        {state?.valid !== undefined && message && (
          <span className={`content-message ${statusClass()}`}>
            {message || 'Required field'}
          </span>
        )}
      </div>

      <div
        className={`date-picker-container__selector ${state?.displayCalendar ? 'date-picker-container__selector--visible' : ''}`}
        ref={contentRef}
      >
        {state?.displayCalendar && (
          <Calendar
            className="date-picker-container__selector--custom"
            selected={state?.date}
            minDate={minDate}
            maxDate={maxDate}
            onChange={value => onSelected(value)}
          />
        )}
      </div>
    </div>
  )
}
