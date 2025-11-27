import React, { useEffect, useRef, useState } from 'react'

import useOutsideClick from '../../../hooks/useOutsideClick'

import { MdOutlineCalendarToday } from 'react-icons/md'

import Calendar from '../Calendar'

import './DateTimerPicker.scss'

export default function DateTimerPicker({
  value,
  label,
  placeholder,
  minDate,
  maxDate,
  valid,
  required,
  message,
  onChange,
  placement,
}) {
  const [state, setState] = useState({
    date: undefined,
    time: undefined,
    inputDate: '',
    displayCalendar: false,
    valid: undefined,
  })

  const [hours, setHours] = useState([])
  const [minutes, setMinutes] = useState([])
  const [timerHeight, setTimerHeight] = useState(300)

  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  var currentDate = new Date()

  useEffect(() => {
    const hoursList = []
    const minutesList = []

    const hour = value?.split(' ')?.[1]?.split(':')?.[0]
    const minute = value?.split(' ')?.[1]?.split(':')?.[1]

    for (let i = 0; i < 24; i++) {
      const formattedHour = ('0' + i).slice(-2)
      if (i === currentDate.getHours()) {
        hoursList.push({
          hour: formattedHour,
          current: hour ? false : true,
          ...(hour && Number(hour) === i && { selected: true }),
        })
      } else {
        hoursList.push({
          hour: formattedHour,
          current: false,
          ...(hour && Number(hour) === i && { selected: true }),
        })
      }
    }

    for (let i = 0; i < 60; i++) {
      const formattedMinute = ('0' + i).slice(-2)

      if (i === currentDate.getMinutes()) {
        minutesList.push({
          minute: formattedMinute,
          current: minute ? false : true,
          ...(minute && Number(minute) === i && { selected: true }),
        })
      } else {
        minutesList.push({
          minute: formattedMinute,
          current: false,
          ...(minute && Number(minute) === i && { selected: true }),
        })
      }
    }

    setHours([...hoursList, ...hoursList])
    setMinutes([...minutesList, ...minutesList])
  }, [])

  useEffect(() => {
    setState({
      ...state,
      date: value,
      time: value?.split?.(' ')?.[1],
      inputDate: value,
      valid: toBoolean(valid),
    })
  }, [valid, value])

  useEffect(() => scrollSelectedDateTimer, [state?.displayCalendar, state.time])

  useEffect(() => {
    onChange?.(state?.inputDate)
  }, [state.inputDate])

  useOutsideClick(containerRef, () => {
    setState({ ...state, displayCalendar: false })
    resetBorderColor()
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
            'date-timer-picker-container__selector--dropup'
          )
        } else {
          contentRef.current.classList.add(
            'date-timer-picker-container__selector--dropup'
          )
        }
      }, 1)
    }
  }

  const onBlur = () => {
    setState({ ...state, date: state?.inputDate })
    onChange?.(state?.inputDate)
  }

  const onSelected = value => {
    const formattedHour =
      currentDate.getHours() < 10
        ? '0' + currentDate.getHours()
        : currentDate.getHours()
    const formattedMinute =
      currentDate.getMinutes() < 10
        ? '0' + currentDate.getMinutes()
        : currentDate.getMinutes()

    if (!state?.inputDate?.includes(':')) {
      setState({
        ...state,
        inputDate: `${value} ${formattedHour}:${formattedMinute}`,
      })

      const hoursList = hours
      const minutesList = minutes

      hoursList.forEach(item => {
        if (Number(item.hour) === currentDate.getHours()) item.selected = true
      })
      minutesList.forEach(item => {
        if (Number(item.minute) === currentDate.getMinutes())
          item.selected = true
      })

      setHours([...hoursList])
      setMinutes([...minutesList])
    } else {
      const inputTime = state?.inputDate?.split(' ')?.[1]?.split(':')?.[0]
      const minuteOfInput = state?.inputDate?.split(':')[1]

      setState({
        ...state,
        inputDate: `${value} ${inputTime}:${minuteOfInput}`,
      })
    }

    resetBorderColor()
  }

  const resetBorderColor = () => {
    inputRef.current.style.borderColor = '#D0D5DD'
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

  const scrollSelectedDateTimer = () => {
    const hourElement = timerRef?.current?.childNodes?.[0]
    const timerElement = timerRef?.current?.childNodes?.[1]
    const hour = value?.split(' ')?.[1]?.split(':')?.[0]
    const minute = value?.split(' ')?.[1]?.split(':')?.[1]

    setTimerHeight(contentRef?.current?.clientHeight - 20)

    if (hourElement) {
      hourElement.scrollTo({
        top: 40 * (hour ? hour : currentDate.getHours()),
        behavior: 'instant',
      })
    }

    if (timerElement) {
      timerElement.scrollTo({
        top: 40 * (minute ? minute : currentDate.getMinutes()),
        behavior: 'instant',
      })
    }
  }

  const infinityScroll = event => {
    const { scrollTop, clientHeight, scrollHeight } = event.target

    if (scrollTop + clientHeight >= scrollHeight) event.target.scrollTo(0, 0)
  }

  const selectTime = (hour, index) => {
    const hoursList = hours

    hoursList.forEach(item => (item.selected = false))
    hoursList[index].selected = true

    setHours([...hoursList])

    if (state?.inputDate && !state?.inputDate?.includes(':')) {
      setState({
        ...state,
        inputDate: `${state.inputDate?.split(' ')?.[0]} ${hour}:${currentDate.getMinutes()}`,
      })
    } else {
      const minuteOfInput = state?.inputDate?.split(':')[1]

      setState({
        ...state,
        inputDate: `${state.inputDate?.split(' ')?.[0]} ${hour}:${minuteOfInput}`,
      })
    }
  }

  const selectMinute = (minute, index) => {
    const minutesList = minutes
    minutesList.forEach(item => (item.selected = false))
    minutesList[index].selected = true
    setMinutes([...minutesList])

    if (state?.inputDate && !state?.inputDate?.includes(':')) {
      setState({
        ...state,
        inputDate: `${state.inputDate?.split(' ')?.[0]} ${currentDate.getHours()}:${minute}`,
      })
    } else {
      const inputTime = state?.inputDate?.split(' ')?.[1]?.split(':')?.[0]

      setState({
        ...state,
        inputDate: `${state.inputDate?.split(' ')?.[0]} ${inputTime}:${minute}`,
      })
    }
  }

  return (
    <div className="date-timer-picker-container" ref={containerRef}>
      <div className="date-timer-picker-container__content">
        <label
          htmlFor={inputRef}
          className="date-timer-picker-container__content--label"
        >
          <span>{label}</span>

          {required && label && (
            <span className="date-timer-picker-container__content--label--required">
              *
            </span>
          )}
        </label>

        <input
          className={`date-timer-picker-container__content--input ${state?.displayCalendar ? 'date-timer-picker-container__content--input--no-focus' : ''} ${state?.valid !== undefined ? (state?.valid ? 'date-timer-picker-container__content--input--valid' : 'date-timer-picker-container__content--input--invalid') : ''}`}
          type="text"
          placeholder={placeholder || 'DD/MM/YYYY HH:MM'}
          value={state?.inputDate}
          onChange={event => formatarData(event?.target?.value)}
          onBlur={onBlur}
          ref={inputRef}
        />

        <MdOutlineCalendarToday
          className={`date-timer-picker-container__content--icon ${label === undefined ? 'date-timer-picker-container__content--no-label' : ''}`}
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
        className={`date-timer-picker-container__selector ${state?.displayCalendar ? 'date-timer-picker-container__selector--visible' : ''} ${placement ? `date-timer-picker-container__selector--${placement}` : ''}`}
        ref={contentRef}
      >
        <div className="d-flex">
          {state?.displayCalendar && (
            <Calendar
              className="date-timer-picker-container__selector--calendar"
              selected={state?.date}
              minDate={minDate}
              maxDate={maxDate}
              onChange={value => onSelected(value)}
            />
          )}

          <div
            className="date-timer-picker-container__selector--timer"
            ref={timerRef}
          >
            <div
              className="date-timer-picker-container__selector--timer--hour"
              style={{
                height: `${timerHeight}px`,
                maxHeight: `${timerHeight}px`,
              }}
              onScroll={infinityScroll}
            >
              {hours.map((hour, index) => (
                <span
                  key={index}
                  className={`${hour.current ? 'date-timer-picker-container__selector--timer--current' : ''} ${hour.selected ? 'date-timer-picker-container__selector--timer--selected' : ''}`}
                  onClick={() => selectTime(hour.hour, index)}
                >
                  {hour.hour}
                </span>
              ))}
            </div>

            <div
              className="date-timer-picker-container__selector--timer--time"
              style={{
                height: `${timerHeight}px`,
                maxHeight: `${timerHeight}px`,
              }}
              onScroll={infinityScroll}
            >
              {minutes.map((minute, index) => (
                <span
                  key={index}
                  className={`${minute.current ? 'date-timer-picker-container__selector--timer--current' : ''} ${minute.selected ? 'date-timer-picker-container__selector--timer--selected' : ''}`}
                  onClick={() => selectMinute(minute.minute, index)}
                >
                  {minute.minute}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
