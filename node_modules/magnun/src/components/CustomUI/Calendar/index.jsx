import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md'

import './Calendar.scss'

export default function Calendar({
  selected,
  minDate,
  maxDate,
  onChange,
  className,
}) {
  const [state, setState] = useState({
    month: selected ? moment(selected, 'DD/MM/YYYY') : moment(),
    selected: moment(selected, 'DD/MM/YYYY') || moment().startOf('day'),
    dates: { start: null, end: null },
    minDate: minDate ? moment(minDate, 'DD/MM/YYYY') : undefined,
    maxDate: maxDate ? moment(maxDate, 'DD/MM/YYYY') : undefined,
    constrols: { previous: true, next: true },
  })

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      selected: selected
        ? moment(selected, 'DD/MM/YYYY')
        : moment().startOf('day'),
    }))
  }, [selected])

  useEffect(() => {
    setState({
      ...state,
      minDate: moment(minDate, 'DD/MM/YYYY'),
    })
  }, [minDate])

  useEffect(() => {
    setState({
      ...state,
      maxDate: moment(maxDate, 'DD/MM/YYYY'),
    })
  }, [maxDate])

  useEffect(() => {
    const { month, minDate, maxDate } = state

    const previousMonth = month.clone().subtract(1, 'month')
    const nextMonth = month.clone().add(1, 'month')

    if (minDate !== undefined && maxDate !== undefined) {
      setState({
        ...state,
        constrols: {
          previous: previousMonth.isSameOrAfter(minDate, 'month'),
          next: nextMonth.isSameOrBefore(maxDate, 'month'),
        },
      })
    }
  }, [state.minDate, state.maxDate, state.month])

  const previous = () => {
    const { month, minDate } = state
    const previousMonth = month.clone().subtract(1, 'month')

    if (
      minDate !== undefined ||
      previousMonth.isSameOrAfter(minDate, 'month')
    ) {
      setState({ ...state, month: previousMonth })
    }
  }

  const next = () => {
    const { month, maxDate } = state
    const nextMonth = month.clone().add(1, 'month')

    if (maxDate !== undefined || nextMonth.isSameOrBefore(maxDate, 'month')) {
      setState({ ...state, month: nextMonth })
    }
  }

  const select = day => {
    setState({ ...state, selected: day.date, month: day.date.clone() })
    onChange?.(day.date.format('DD/MM/YYYY'))
  }

  const getWeeks = () => {
    let weeks = []
    let concluded = false
    let date = state.month
      .clone()
      .startOf('month')
      .add('w' - 1)
      .day('Sunday')
    let count = 0
    let monthIndex = date.month()

    const { selected, month, minDate, maxDate } = state

    while (!concluded) {
      weeks.push(
        <Week
          key={uuid()}
          date={date.clone()}
          month={month}
          select={(day, event) => select(day, event)}
          selected={selected}
          minDate={minDate}
          maxDate={maxDate}
        />
      )

      date.add(1, 'w')

      concluded = count++ > 2 && monthIndex !== date.month()
      monthIndex = date.month()
    }

    return weeks
  }

  return (
    <div className={`calendar-container ${className}`}>
      <div className="calendar-container__header">
        <div className="header-controls">
          <div
            className={`header-controls__buttons ${!state.constrols.previous ? 'header-controls__buttons--disabled' : ''}`}
          >
            <MdNavigateBefore onClick={() => previous()} />
          </div>

          <div>
            <span
              className={`size-14 weight-500`}
              style={{ textTransform: 'capitalize' }}
            >
              {state.month.format('MMMM YYYY')}
            </span>
          </div>

          <div
            className={`header-controls__buttons ${!state.constrols.next ? 'header-controls__buttons--disabled' : ''}`}
          >
            <MdNavigateNext onClick={() => next()} />
          </div>
        </div>

        <Days />
      </div>

      <div className="calendar-container__content">{getWeeks()}</div>
    </div>
  )
}

const Days = () => {
  return (
    <div className="weekly-days">
      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
        <span key={index} className="day">
          {day}
        </span>
      ))}
    </div>
  )
}

const Week = props => {
  let days = []
  let { date } = props

  const { month, selected, select, minDate, maxDate } = props

  for (var i = 0; i < 7; i++) {
    let day = {
      name: date.format('dd').substring(0, 1),
      number: date.date(),
      isCurrentMonth: date.month() === month.month(),
      isToday: date.isSame(new Date(), 'day'),
      date: date,
    }

    days.push(
      <Day
        key={uuid()}
        day={day}
        selected={selected}
        select={select}
        minDate={minDate}
        maxDate={maxDate}
      />
    )

    date = date.clone()
    date.add(1, 'day')
  }

  return (
    <div className="week" key={days[0]}>
      {days}
    </div>
  )
}

const Day = props => {
  const {
    day,
    day: { date, isCurrentMonth, isToday, number },
    select,
    selected,
    minDate,
    maxDate,
  } = props

  const isBeforeMinDate = minDate && date.isBefore(minDate, 'day')
  const isAfterMaxDate = maxDate && date.isAfter(maxDate, 'day')

  const dayClass = `day ${isToday ? 'today' : ''} ${
    isCurrentMonth ? '' : 'another-month'
  } ${date.isSame(selected) ? 'selected' : ''} ${
    isBeforeMinDate || isAfterMaxDate ? 'unselectable-dates' : ''
  }`

  return (
    <div
      key={uuid()}
      className={dayClass}
      onClick={event =>
        isBeforeMinDate || isAfterMaxDate ? null : select(day, event)
      }
    >
      {number}
    </div>
  )
}
