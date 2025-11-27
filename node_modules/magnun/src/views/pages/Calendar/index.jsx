import React, { useEffect, useRef, useState } from 'react'
import { translate } from '../../../hooks/translate'
import { useLocalStorage } from '../../../hooks/useLocalStorage'
import useScroll from '../../../hooks/useScroll'
import { useTheme } from '../../../hooks/useTheme'
import { textTransform } from '../../../utils/utils'

import useOutsideClick from '../../../hooks/useOutsideClick'

import enLocale from '@fullcalendar/core/locales/en-au'
import esLocale from '@fullcalendar/core/locales/es'
import ptLocale from '@fullcalendar/core/locales/pt-br'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import rrulePlugin from '@fullcalendar/rrule'
import timeGridPlugin from '@fullcalendar/timegrid'

import { Accordion, AccordionItem } from '../../../components/BaseUI/Accordion'
import Button from '../../../components/BaseUI/Button'
import IconButton from '../../../components/BaseUI/Button/IconButton'
import ButtonGroup from '../../../components/BaseUI/ButtonGroup'
import Checkbox from '../../../components/BaseUI/Checkbox'
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
} from '../../../components/BaseUI/Dropdown'
import Input from '../../../components/BaseUI/Input'
import Label from '../../../components/BaseUI/Label'
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '../../../components/BaseUI/Modal'
import Radio from '../../../components/BaseUI/Radio'
import Select from '../../../components/BaseUI/Select'
import AppPage from '../../../components/CustomUI/AppPage'
import Avatar from '../../../components/CustomUI/Avatar'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'
import DatePicker from '../../../components/CustomUI/DatePicker'
import DateTimerPicker from '../../../components/CustomUI/DateTimerPicker'
import RichTextEditor from '../../../components/CustomUI/RichTextEditor'
import TagText from '../../../components/CustomUI/TagText'

import {
  MdAdd,
  MdOutlineAccessTime,
  MdOutlineClose,
  MdOutlineDeleteOutline,
  MdOutlineDuo,
  MdOutlineFormatAlignLeft,
  MdOutlineModeEditOutline,
  MdOutlinePeopleOutline,
} from 'react-icons/md'

import createdByImage from '../../../assets/users/carolina.avif'
import usersJson from '../../../mocks/sellers.json'

import './Calendar.scss'

const Calendar = () => {
  const theme = useTheme()
  const { getStorage } = useLocalStorage()
  const { scrolledPage } = useScroll()

  const calendarRef = useRef(null)
  const eventDropdowRef = useRef(null)
  const fullCalendarRef = useRef(null)

  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [eventTypeFilter, setEventTypeFilter] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [eventInfo, setEventInfo] = useState({
    title: '',
    start: '',
    end: '',
    id: '',
    url: '',
    classNames: '',
    type: '',
    guests: [],
    location: '',
    description: '',
    repeat: 'never',
    allDay: true,
    createdBy: {
      name: 'Carolina Ferreira',
      image: createdByImage,
    },
    excludeDates: [],
  })
  const [loadEvents, setLoadEvents] = useState(false)
  const [, setNewEvent] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState()
  const [eventType, setEventType] = useState('')
  const [users] = useState(
    usersJson.map(user => ({
      label: user.name,
      value: user.id,
    }))
  )
  const [viewEventMobile, setViewEventMobile] = useState(false)
  const [screenSize, setScreenSize] = useState(window?.innerWidth)
  const [language, setLanguage] = useState(null)
  const [defaultView, setDefaultView] = useState('Month')
  const [deleteRecurringEvent, setDeleteRecurringEvent] = useState(false)
  const [recurringEventTypeExcluded, setRecurringEventTypeExcluded] =
    useState(1)

  const typesEvent = [
    {
      name: translate('CALENDAR.EVENT'),
      type: 'event',
      value: 'event-primary',
    },
    {
      name: translate('CALENDAR.REMINDER'),
      type: 'reminder',
      value: 'event-warning',
    },
    { name: translate('CALENDAR.TASK'), type: 'task', value: 'event-success' },
    {
      name: translate('CALENDAR.BIRTHDAY'),
      type: 'birthday',
      value: 'event-danger',
    },
  ]

  const repeatOptions = [
    { value: 'daily', label: translate('UI.DAILY'), type: 'daily' },
    { value: 'weekly', label: translate('UI.WEEKLY'), type: 'weekly' },
    { value: 'never', label: translate('UI.NEVER'), type: 'never' },
  ]

  const locales = {
    'pt-BR': ptLocale,
    'es-ES': esLocale,
    'en-US': enLocale,
  }

  const daysOfWeek = [
    translate('DAYSOFWEEK.SUNDAY'),
    translate('DAYSOFWEEK.MONDAY'),
    translate('DAYSOFWEEK.TUESDAY'),
    translate('DAYSOFWEEK.WEDNESDAY'),
    translate('DAYSOFWEEK.THURSDAY'),
    translate('DAYSOFWEEK.FRIDAY'),
    translate('DAYSOFWEEK.SATURDAY'),
  ]

  const headerToolbar = {
    left: 'today,prev,next,title',
    right: 'filterEvent,changeView', // creatEvent
  }

  useEffect(() => {
    setLanguage(getStorage('lang'))
    const calendarView = getStorage('calendarView')

    if (calendarView) setDefaultView(calendarView)
  }, [])

  useEffect(() => handleViewChange(defaultView?.toLowerCase()), [defaultView])

  useEffect(() => {
    setScreenSize(window?.innerWidth)
  }, [window?.innerWidt])

  useEffect(() => {
    const storageEvents = JSON.parse(localStorage.getItem('events'))
    const filteredEventTypes = JSON.parse(
      localStorage.getItem('filteredEventTypes')
    )

    storageEvents?.forEach(event => {
      if (event.repeat !== 'never') {
        event.rrule = {
          freq: event.repeat,
          dtstart: `${event?.start?.split('T')[0]}T${event.startDate?.split('T')[1]}`,
          ...(event.interval && { interval: event.interval }),
        }

        if (event?.removeAllAfterCurrent?.length) {
          event.exrule = {
            freq: event.repeat,
            dtstart: event.removeAllAfterCurrent,
          }
        }

        if (event?.excludeDates?.length) event.exdate = [...event.excludeDates]
      }
    })

    if (storageEvents) {
      setEvents([...storageEvents])

      if (filteredEventTypes) {
        setEventTypeFilter([...filteredEventTypes])
        setFilteredEvents([
          ...(storageEvents?.filter(event =>
            filteredEventTypes.includes(event.type)
          ) ?? []),
        ])

        return
      }

      setEventTypeFilter([...storageEvents.map(event => event.type)])
      setFilteredEvents([...storageEvents])
    }
  }, [loadEvents])

  useEffect(() => {
    const fullcalendar = calendarRef?.current?.childNodes?.[0]

    if (theme === 'dark') {
      fullcalendar.classList.add('fc-dark')
    } else {
      fullcalendar.classList.remove('fc-dark')
    }
  }, [theme])

  useEffect(() => {
    const calendarElement = calendarRef.current

    const resizeObserver = new ResizeObserver(() => {
      const calendarApi = fullCalendarRef?.current?.getApi()

      setTimeout(() => calendarApi?.updateSize(), 1)
    })

    resizeObserver.observe(calendarElement)

    return () => {
      resizeObserver.unobserve(calendarElement)
    }
  }, [])

  useEffect(() => {
    const dayGridElements = document.querySelectorAll('.fc-daygrid-day-events')

    const dayGridFiltered = Array.from(dayGridElements).filter(element => {
      const filhosComClasse = element.querySelectorAll(
        '.fc-daygrid-event-harness'
      )
      return filhosComClasse.length > 1
    })

    dayGridFiltered?.forEach(element => {
      const chidrens = Array.from(element?.childNodes)?.slice(0, -2)

      chidrens?.forEach(children => children.classList.add('my-custom-class'))
    })
  }, [events])

  useEffect(() => {
    const eventContainer = document.querySelector('.event-dropdown')
    if (eventContainer) eventContainer?.remove()
  }, [scrolledPage])

  useOutsideClick(calendarRef, () => closeDropdowns())

  const closeDropdowns = () => {
    const nodeFilterFc = document.getElementById('dropdown-filter-fc')
    const changeViewFc = document.getElementById('dropdown-change-view-fc')

    if (nodeFilterFc?.parentNode) {
      nodeFilterFc.parentNode.removeChild(nodeFilterFc)
    }

    if (changeViewFc?.parentNode) {
      changeViewFc.parentNode.removeChild(changeViewFc)
    }
  }

  const handleDateClick = () => {
    closeDropdowns()
  }

  const formatDisplayDate = date => {
    const dateParts = date?.split('T')

    if (!dateParts) return

    if (date?.includes('00:00'))
      return dateParts[0].split('-').reverse().join('/')

    return `${dateParts[0].split('-').reverse().join('/')} ${dateParts[1]}`
  }

  const handleEventClick = ({ event, el, jsEvent }) => {
    const element = el
    jsEvent.preventDefault()

    setEventInfo({
      title: event.title,
      start: adjustDraggableEventDates(event, 'start'),
      startDate: adjustDraggableEventDates(event, 'start'),
      formattedStartDate: formatDisplayDate(
        formatDateToISOString(event?.start)
      ),
      end: adjustDraggableEventDates(event, 'end'),
      endDate: adjustDraggableEventDates(event, 'end'),
      formattedEndDate: formatDisplayDate(
        formatDateToISOString(event?.end || event?.start)
      ),
      id: event.id,
      url: event.url,
      classNames: event.classNames,
      type: event.extendedProps.type,
      guests: event.extendedProps.guests,
      location: event.extendedProps.location,
      description: event.extendedProps.description,
      repeat: event.extendedProps.repeat,
      allDay: event.allDay,
      createdBy: event.extendedProps.createdBy,
      excludeDates: event.extendedProps.excludeDates,
    })

    setTimeout(() => {
      const parentElement = element.parentElement.parentElement
      parentElement.style.position = 'relative'
      parentElement.appendChild(eventDropdowRef.current)

      const { left, width, top } = element.getBoundingClientRect()
      const { width: dropdownWidth, height: dropdownHeight } =
        eventDropdowRef.current.getBoundingClientRect()
      const { width: calendarWidth } =
        fullCalendarRef.current.elRef.current.getBoundingClientRect()

      let elements = Array.from(document.body.querySelectorAll('[class]'))

      const hasAMobileMenu = elements.some(element => {
        let classes =
          element.className.baseVal !== undefined
            ? element.className.baseVal.split(' ')
            : element.className.split(' ')

        return classes.some(cls => cls.includes('Default_mobile__sidebar'))
      })

      let dropdownTop, dropdownLeft

      if (
        parseInt(
          left + (hasAMobileMenu ? (dropdownWidth + 70) / 2 : dropdownWidth / 2)
        ) > parseInt(calendarWidth)
      ) {
        dropdownLeft = left - (dropdownWidth + 20)
      } else {
        dropdownLeft = left + width + 20
      }

      dropdownTop = top - dropdownHeight / 2

      if (defaultView === 'Day')
        dropdownLeft = window.innerWidth / 2 - dropdownWidth / 2

      setDropdownStyle({
        ...dropdownStyle,
        left: `${Math.abs(dropdownLeft)}px`,
        top: `${Math.abs(dropdownTop)}px`,
      })
    }, 0)

    if (screenSize < 767) {
      setViewEventMobile(true)
    } else {
      if (screenSize > 767) eventDropdowRef?.current?.classList.add('show')
    }

    window.addEventListener('resize', () => {
      if (screenSize < 767) {
        setViewEventMobile(true)
      } else {
        if (screenSize > 767) eventDropdowRef?.current?.classList.add('show')
      }
    })
  }

  const handleNewEvent = (type, className) => {
    setOpenModal(true)

    setEventInfo({
      ...eventInfo,
      classNames: className,
      type,
      id: generateRandomId(),
    })

    setNewEvent(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    clearEventInfo()
    setEventType('')
  }

  const handleEventInclusion = id => {
    const hasExist = events.findIndex(event => Number(event.id) === id)
    const values = events

    if (hasExist === -1) {
      setEvents([...values, eventInfo])
      persistEventsInLocalStorage(eventInfo, -1)
      setOpenModal(false)
      clearEventInfo()
      setLoadEvents(true)
      setNewEvent(false)

      return
    }

    values?.forEach(event => {
      if (Number(event.id) === id) {
        event.title = eventInfo.title
        event.start = eventInfo.start
        event.startDate = eventInfo.startDate
        event.end = eventInfo.end
        event.endDate = eventInfo.endDate
        event.url = eventInfo.url || ''
        event.classNames = eventInfo.classNames
        event.type = eventInfo.type
        event.guests = eventInfo.guests
        event.location = eventInfo.location
        event.description = eventInfo.description
        event.repeat = eventInfo.repeat
        event.createdBy = eventInfo.createdBy
      }
    })

    setEvents([...values])
    setOpenModal(false)
    persistEventsInLocalStorage({}, hasExist, true)
  }

  const handleEventDeletion = event => {
    if (event.repeat !== 'never') return setDeleteRecurringEvent(true)

    deleteEvent(event)
  }

  const deleteEvent = event => {
    const index = events.findIndex(item => Number(item.id) === Number(event.id))
    const values = events

    if (event.repeat !== 'never') {
      let excludeDates = [...event.excludeDates]
      let removeAllAfterCurrent = null

      if (recurringEventTypeExcluded === 1)
        excludeDates = [...event.excludeDates, event?.start?.split('T')[0]]

      if (recurringEventTypeExcluded === 2)
        removeAllAfterCurrent = event?.start?.split('T')[0]

      values.forEach(value => {
        delete value.rrule
        delete value.exdate
        delete value.exrule

        if (Number(value.id) === Number(event.id)) {
          value.excludeDates = excludeDates
          value.removeAllAfterCurrent = removeAllAfterCurrent
        }
      })

      setEvents([...values])
      persistEventsInLocalStorage(
        {},
        recurringEventTypeExcluded === 3 ? index : -1
      )
      setDeleteRecurringEvent(false)
      setLoadEvents(false)

      eventDropdowRef.current.parentElement.parentElement.lastElementChild.remove()
      setLoadEvents(true)
    } else {
      persistEventsInLocalStorage({}, index)
      setLoadEvents(true)
      setViewEventMobile(false)
      setOpenModal(false)
    }
  }

  const handleEventDraggable = ({ event }) => {
    const draggableIndex = events.findIndex(
      item => Number(item.id) === Number(event.id)
    )

    const draggableEvent = {
      title: event.title,
      start: adjustDraggableEventDates(event, 'start'),
      startDate: adjustDraggableEventDates(event, 'start'),
      end: adjustDraggableEventDates(event, 'end'),
      endDate: adjustDraggableEventDates(event, 'end'),
      id: event.id,
      url: event.url,
      classNames: event?.classNames,
      type: event.extendedProps?.type,
      guests: event.extendedProps?.guests,
      location: event.extendedProps?.location,
      description: event.extendedProps?.description,
      repeat: event.extendedProps?.repeat,
      allDay: event?.allDay,
      createdBy: event.extendedProps?.createdBy,
      excludeDates: event.extendedProps?.excludeDates,
    }

    persistEventsInLocalStorage(draggableEvent, draggableIndex)
  }

  const adjustDraggableEventDates = (event, field) => {
    if (event.allDay) return formatDateToISOString(event?.start)

    if (field === 'start') {
      return formatDateToISOString(event?.start)
    }

    if (field === 'end') {
      const start = formatDateToISOString(event?.start)

      return event?.end
        ? formatDateToISOString(event?.end)
        : `${start?.split('T')?.[0]}T${event.extendedProps?.endDate?.split('T')?.[1]}`
    }
  }

  const clearEventInfo = () => {
    setEventInfo({
      title: '',
      start: '',
      end: '',
      id: '',
      url: '',
      classNames: '',
      type: '',
      guests: [],
      location: '',
      description: '',
      repeat: 'never',
      allDay: true,
      createdBy: {
        name: 'Beatriz Lopes',
        image: createdByImage,
      },
    })
  }

  const formatDateToISOString = date => {
    const dateValue = typeof date === 'object' ? date : new Date(date)

    return new Date(dateValue.getTime() - dateValue.getTimezoneOffset() * 60000)
      .toISOString()
      .split('.')[0]
  }

  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000)
  }

  const persistEventsInLocalStorage = (
    event = {},
    index = -1,
    editing = false
  ) => {
    const values = events

    if (editing) {
      localStorage.setItem('events', JSON.stringify([...values]))
      setLoadEvents(true)
      return
    }

    if (index !== -1) {
      values.splice(index, 1)

      if (Object.keys(event || [])?.length)
        localStorage.setItem('events', JSON.stringify([...values, event]))
      else localStorage.setItem('events', JSON.stringify([...values]))

      setLoadEvents(true)
      return
    }

    if (values?.length > 0 && Object.keys(event || [])?.length)
      localStorage.setItem('events', JSON.stringify([...values, event]))
    else if (values?.length > 0 && !Object.keys(event || [])?.length)
      localStorage.setItem('events', JSON.stringify([...values]))
    else localStorage.setItem('events', JSON.stringify([event]))

    setLoadEvents(true)
  }

  const injectDropdownList = event => {
    closeDropdowns()

    const parentElement = event.target.parentElement
    parentElement.style.position = 'relative'

    const dropdown = `<div class="dropdown-container-fc dropdown-container-fc__filter" id="dropdown-filter-fc">
            <ul class="dropdown-container-fc__filter__list">
                ${typesEvent
                  .map(
                    event =>
                      `<li class="list__item" onclick="getFilterFc(this, '${event.type}')">
                        <input type="checkbox" class="checkbox-fc ${event.type}" value="${event.type}" ${eventTypeFilter.includes(event.type) ? 'checked' : ''} value="${event.type}"/>
                        <span>${event.name}</span>
                    </li>`
                  )
                  .join('')}
            </ul>
        </div>`
    parentElement.insertAdjacentHTML('beforeend', dropdown)
  }

  const injectDropdownChangeView = event => {
    closeDropdowns()

    event.target.style.position = 'relative'

    const options = [
      { label: translate('UI.DAY'), value: 'day' },
      { label: translate('UI.WEEK'), value: 'week' },
      { label: translate('UI.MONTH'), value: 'month' },
    ]

    const dropdown = `<div class="dropdown-container-fc dropdown-container-fc__change-view" id="dropdown-change-view-fc">
            ${options
              .map(
                option =>
                  `<div class="dropdown-container-fc__change-view--item ${defaultView?.toLowerCase() === option.value ? 'dropdown-container-fc__change-view--item--active' : ''}" onclick="createChageViewFc(this, '${option.value}')">
                  ${option.label}
                </div>`
              )
              .join('')}
        </div>`

    event.target.insertAdjacentHTML('beforeend', dropdown)
  }

  const handleCloseDropdown = () => {
    eventDropdowRef?.current.classList.remove('show')
    setViewEventMobile(false)
    clearEventInfo()
  }

  const handleEventEdit = () => {
    setViewEventMobile(false)
    setOpenModal(true)
  }

  const openMeetingLink = url => window.open(url, 'blank')

  const handleEventRepetition = value => {
    if (value === 'never') {
      setEventInfo({ ...eventInfo, repeat: value })
      return
    }

    const options = {
      d: [0, 1, 2, 3, 4, 5, 6],
      s: [new Date(eventInfo?.start)?.getDay()],
    }

    setEventInfo({
      ...eventInfo,
      repeat: value,
      daysOfWeek: options[value],
      createdAt: new Date(),
    })
  }

  const handleViewChange = value => {
    const views = {
      day: 'timeGridDay',
      week: 'timeGridWeek',
      month: 'dayGridMonth',
    }

    const calendarApi = fullCalendarRef.current.getApi()
    calendarApi.changeView(views[value])
  }

  const formatDate = date => {
    if (!date) return ''

    return new Date(date).toLocaleDateString(language, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = date => {
    if (!date) return ''

    let time = new Date(date).toLocaleTimeString(language, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })

    return time.replace(' ', '')
  }

  function EventDate({ start, end }) {
    const startDate = formatDate(start, language)
    const endDate = formatDate(end, language)
    const startTime = formatTime(start, language)
    const endTime = formatTime(end, language)
    const startPeriod = startTime.slice(-2)
    const endPeriod = endTime.slice(-2)

    if (eventInfo?.allDay) {
      return (
        <div className="content__date content__info">
          <MdOutlineAccessTime />
          {startDate}
        </div>
      )
    }

    if (startDate === endDate && !eventInfo.allDay) {
      if (startPeriod === endPeriod) {
        return (
          <div className="content__date content__info">
            <MdOutlineAccessTime />
            {startDate}, {startTime.slice(0, -2)}{' '}
            {textTransform('lowercase', translate('FRAGMENTS.UNTIL'))} {endTime}
          </div>
        )
      } else {
        return (
          <div className="content__date content__info">
            <MdOutlineAccessTime />
            {startDate}, {startTime}{' '}
            {textTransform('lowercase', translate('FRAGMENTS.UNTIL'))} {endTime}
          </div>
        )
      }
    } else {
      return (
        <div className="content__date content__info">
          <MdOutlineAccessTime />
          {startDate}, {startTime} – {endDate}, {endTime}
        </div>
      )
    }
  }

  const createEventFc = (type, value) => {
    handleNewEvent(type, value)
    setEventType(typesEvent.find(event => event.type === type).name)
  }

  const renderEventContent = eventInfo => {
    const { event } = eventInfo

    return (
      <div className="fc-event-content">
        <div className="fc-event-content__title">{event.title}</div>
      </div>
    )
  }

  const convertToIsoDate = date => {
    if (!date) return ''

    const parts = date.split(/[/ :]/)

    const newDate = new Date(
      parts[2],
      parts[1] - 1,
      parts[0],
      parts[3] || 0,
      parts[4] || 0
    )

    if (!parts[3] && !parts[4]) {
      newDate.setHours(0, 0, 0, 0)
    }

    const offset = newDate.getTimezoneOffset()
    newDate.setMinutes(newDate.getMinutes() - offset)

    return newDate.toISOString().slice(0, 16)
  }

  window.getFilterFc = (element, value) => {
    let filteredTypes = eventTypeFilter

    if (eventTypeFilter?.includes(value)) {
      filteredTypes = eventTypeFilter?.filter(type => type !== value)
    } else {
      filteredTypes.push(value)
    }

    element.firstElementChild.checked = filteredTypes?.includes(value)

    const eventsFilteredByType = events?.filter(event =>
      filteredTypes.includes(event.type)
    )

    setEventTypeFilter([...filteredTypes])
    setFilteredEvents([...eventsFilteredByType])

    localStorage.setItem('filteredEventTypes', JSON.stringify(filteredTypes))
  }

  window.createChageViewFc = (element, value) => {
    const labels = {
      day: translate('UI.DAY'),
      week: translate('UI.WEEK'),
      month: translate('UI.MONTH'),
    }

    handleViewChange(value)
    setDefaultView(labels[value])

    localStorage.setItem('calendarView', JSON.stringify(labels[value]))
  }

  return (
    <AppPage
      title={translate('CALENDAR.MY_COMMITMENTS')}
      description={translate('CALENDAR.MY_COMMITMENTS_INFO')}
      className="calendar-page"
      breadcrumbs={[
        { label: 'Magnun', url: '' },
        { label: translate('CALENDAR.TITLE') },
      ]}
      actions={
        <Dropdown
          trigger={
            <Button
              title={translate('CALENDAR.CREATE_NEW_EVENT')}
              appearance="primary"
              useIcon={{
                direction: 'left',
                icon: <MdAdd />,
              }}
            />
          }
          hideDropdownIcon={true}
          placement="right"
        >
          <DropdownContent className="calendar-page__create-event-container">
            {typesEvent?.map((type, index) => (
              <DropdownItem
                key={index}
                onClick={() => createEventFc(type.type, type.value)}
              >
                <span className={`dot-info dot-info--${type.type}`}></span>
                <span>{type.name}</span>
              </DropdownItem>
            ))}
          </DropdownContent>
        </Dropdown>
      }
    >
      <Container>
        <ContainerItem sm={4} md={8} xl={12}>
          <div ref={calendarRef} style={{ position: 'relative' }}>
            <FullCalendar
              customButtons={{
                filterEvent: {
                  text: translate('UI.FILTER'),
                  click: event => injectDropdownList(event),
                },
                changeView: {
                  text: defaultView,
                  click: event => injectDropdownChangeView(event),
                },
              }}
              plugins={[
                rrulePlugin,
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
              ]}
              initialView="dayGridMonth"
              events={filteredEvents}
              dateClick={args => handleDateClick(args)}
              eventClick={event => handleEventClick(event)}
              headerToolbar={headerToolbar}
              editable={true}
              droppable={true}
              dragRevertDuration={0}
              eventDrop={event => handleEventDraggable(event)}
              locale={locales[language]}
              eventContent={renderEventContent}
              ref={fullCalendarRef}
              dayMaxEvents={2}
            />
          </div>
        </ContainerItem>
      </Container>

      <div
        ref={eventDropdowRef}
        style={dropdownStyle}
        className="event-dropdown"
      >
        <div className="d-flex align-items-center justify-content-end gap-1 u-pointer mb-3 pr-1">
          {eventInfo.url && (
            <IconButton
              icon={<MdOutlineDuo className="event-link" />}
              appearance="subtle"
              shape="cirle"
              onClick={() => openMeetingLink(eventInfo.url)}
            />
          )}

          <IconButton
            icon={<MdOutlineModeEditOutline />}
            appearance="subtle"
            shape="cirle"
            onClick={() => handleEventEdit()}
          />

          <IconButton
            icon={<MdOutlineDeleteOutline />}
            appearance="subtle"
            shape="cirle"
            onClick={() => handleEventDeletion(eventInfo)}
          />

          <IconButton
            icon={<MdOutlineClose />}
            appearance="subtle"
            shape="cirle"
            onClick={() => handleCloseDropdown()}
          />
        </div>

        <div className="event-dropdown__content">
          <div className="content__title content__info">
            {eventInfo?.title || translate('UI.EMPTY')}
          </div>

          <EventDate start={eventInfo?.start} end={eventInfo?.end} />

          {eventInfo?.repeat && eventInfo?.repeat !== 'n' && (
            <div className="content__repeat content__info">
              {eventInfo?.repeat === 'daily' && (
                <span>{translate('CALENDAR.EVERY_DAY')}</span>
              )}
              {eventInfo?.repeat === 'weekly' && (
                <span>
                  {translate('DAYSOFWEEK.WEEKLY')}:{' '}
                  {translate('FRAGMENTS.EVERY')}{' '}
                  {daysOfWeek[new Date(eventInfo?.start?.split('T')).getDay()]}
                </span>
              )}
            </div>
          )}

          {eventInfo?.guests?.length > 0 && (
            <div className="content__guests content__info">
              <MdOutlinePeopleOutline
                style={{ fontSize: '22px', marginTop: '2px' }}
              />

              <Accordion
                items={[
                  {
                    title: `${eventInfo?.guests?.length} ${translate('UI.GUESTS')}`,
                  },
                ]}
                borderless
                gap="0"
                accordionClassName="content__guests--accordion"
                accordionItemClassName="content__guests--accordion--header"
              >
                <AccordionItem>
                  {users
                    .filter(user => eventInfo?.guests?.includes(user.value))
                    ?.map((user, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center gap-1"
                      >
                        <Avatar
                          src={user?.image}
                          name={user.label}
                          size="small"
                        />

                        <div>{user.label}</div>
                      </div>
                    ))}
                </AccordionItem>
              </Accordion>
            </div>
          )}

          {eventInfo?.description && (
            <div className="content__description content__info">
              <MdOutlineFormatAlignLeft />
              <TagText>{eventInfo?.description}</TagText>
            </div>
          )}

          <div className="content__author content__info">
            <Avatar
              src={eventInfo?.createdBy?.image}
              name={eventInfo?.createdBy.name}
              size="small"
            />
            <div>{eventInfo?.createdBy.name}</div>
          </div>
        </div>
      </div>

      <Modal isOpen={openModal} width="medium" scrollBehavior="inside">
        <ModalHeader closeButton={true} onClose={handleCloseModal}>
          {translate('UI.CREATE')} {eventType?.toLowerCase()}
        </ModalHeader>
        <ModalBody>
          <div className="d-fex flex-column">
            <Input
              type="text"
              value={eventInfo.title}
              label={translate('UI.TITLE')}
              onChange={event =>
                setEventInfo({ ...eventInfo, title: event.target.value })
              }
            />

            <div className="d-flex align-items-center gap-1">
              {eventInfo?.allDay ? (
                <DatePicker
                  label={translate('FRAGMENTS.IN')}
                  value={eventInfo?.formattedStartDate}
                  onChange={value =>
                    setEventInfo({
                      ...eventInfo,
                      start: convertToIsoDate(value),
                      startDate: convertToIsoDate(value),
                    })
                  }
                />
              ) : (
                <DateTimerPicker
                  label={translate('FRAGMENTS.IN')}
                  value={eventInfo?.formattedEndDate}
                  onChange={value =>
                    setEventInfo({
                      ...eventInfo,
                      start: convertToIsoDate(value),
                      startDate: convertToIsoDate(value),
                    })
                  }
                />
              )}

              {eventInfo.allDay ? (
                <DatePicker
                  label={translate('FRAGMENTS.UNTIL')}
                  value={eventInfo?.formattedStartDate}
                  onChange={value =>
                    setEventInfo({
                      ...eventInfo,
                      end: convertToIsoDate(value),
                      endDate: convertToIsoDate(value),
                    })
                  }
                />
              ) : (
                <DateTimerPicker
                  label={translate('FRAGMENTS.UNTIL')}
                  placement="right"
                  value={eventInfo?.formattedEndDate}
                  onChange={value =>
                    setEventInfo({
                      ...eventInfo,
                      end: convertToIsoDate(value),
                      endDate: convertToIsoDate(value),
                    })
                  }
                />
              )}
            </div>

            <div className="d-flex align-items-center gap-1 mt-3">
              <Select
                label={translate('UI.REPEAT')}
                options={repeatOptions}
                unique={true}
                selected={eventInfo?.repeat || 'never'}
                onSelected={selected =>
                  handleEventRepetition(selected[0].value)
                }
                required
              />

              <div className="w-20 mt-3">
                <Checkbox
                  label={translate('CALENDAR.ALL_DAY')}
                  value="allDay"
                  isChecked={true}
                  onChange={({ checked }) =>
                    setEventInfo({ ...eventInfo, allDay: checked })
                  }
                />
              </div>
            </div>

            <Select
              label={translate('UI.GUESTS')}
              options={users}
              onSelected={selected =>
                setEventInfo({
                  ...eventInfo,
                  guests: selected?.map(item => item.value),
                })
              }
              selected={eventInfo?.guests}
            />

            <div className="mb-4">
              <Label>{translate('UI.DESCRIPTION')}</Label>

              <RichTextEditor
                content={''}
                useBorder
                onChange={({ content }) =>
                  setEventInfo({ ...eventInfo, description: content?.html })
                }
              />
            </div>

            <Input
              type="url"
              value={eventInfo.url}
              label={translate('CALENDAR.MEETING_LINK')}
              onChange={event =>
                setEventInfo({ ...eventInfo, url: event.target.value })
              }
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup placement="end">
            <Button
              title={translate('UI.CANCEL')}
              appearance="soft-link"
              onClick={() => {
                setOpenModal(false)
              }}
            />
            <Button
              title={translate('UI.CREATE')}
              appearance="primary"
              onClick={() => handleEventInclusion(Number(eventInfo.id))}
            />
          </ButtonGroup>
        </ModalFooter>
      </Modal>

      <Modal isOpen={viewEventMobile} width="small">
        <ModalBody>
          <div
            className="event-dropdown"
            style={{
              position: 'relative',
              display: 'block',
              boxShadow: 'unset',
              border: 'unset',
              padding: 0,
              width: '380px',
              minWidth: '380px',
            }}
          >
            <div className="d-flex align-items-center justify-content-end gap-1 u-pointer mb-3 pr-3">
              {eventInfo.url && (
                <IconButton
                  icon={<MdOutlineDuo className="event-link" />}
                  appearance="subtle"
                  shape="cirle"
                  onClick={() => openMeetingLink(eventInfo.url)}
                />
              )}

              <IconButton
                icon={<MdOutlineModeEditOutline />}
                appearance="subtle"
                shape="cirle"
                onClick={() => handleEventEdit()}
              />

              <IconButton
                icon={<MdOutlineDeleteOutline />}
                appearance="subtle"
                shape="cirle"
                onClick={() => handleEventDeletion(eventInfo)}
              />

              <IconButton
                icon={<MdOutlineClose />}
                appearance="subtle"
                shape="cirle"
                onClick={() => handleCloseDropdown()}
              />
            </div>

            <div className="event-dropdown__content">
              <div className="content__title content__info">
                {eventInfo?.title || translate('UI.EMPTY')}
              </div>

              <EventDate start={eventInfo?.start} end={eventInfo?.end} />

              {eventInfo?.repeat && eventInfo?.repeat !== 'n' && (
                <div className="content__repeat content__info">
                  {eventInfo?.repeat === 'daily' && (
                    <span>{translate('CALENDAR.EVERY_DAY')}</span>
                  )}
                  {eventInfo?.repeat === 'weekly' && (
                    <span>
                      {translate('DAYSOFWEEK.WEEKLY')}:{' '}
                      {translate('FRAGMENTS.EVERY')}{' '}
                      {
                        daysOfWeek[
                          new Date(eventInfo?.start?.split('T')).getDay()
                        ]
                      }
                    </span>
                  )}
                </div>
              )}

              {eventInfo?.guests?.length > 0 && (
                <div className="content__guests content__info">
                  <MdOutlinePeopleOutline />

                  <Accordion
                    items={[
                      {
                        title: `${eventInfo?.guests?.length} ${translate('UI.GUESTS')}`,
                      },
                    ]}
                    borderless={true}
                    accordionClassName="content__guests--accordion"
                    accordionItemClassName="content__guests--accordion--header"
                  >
                    <AccordionItem className="p-5">
                      {users
                        .filter(user => eventInfo?.guests?.includes(user.value))
                        ?.map((user, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center gap-1"
                          >
                            <Avatar
                              image={user?.image}
                              name={user.label}
                              size="small"
                            />

                            <div>{user.label}</div>
                          </div>
                        ))}
                    </AccordionItem>
                  </Accordion>
                </div>
              )}

              {eventInfo?.description && (
                <div className="content__description content__info">
                  <MdOutlineFormatAlignLeft />
                  <TagText>{eventInfo?.description}</TagText>
                </div>
              )}

              <div className="content__author content__info">
                <Avatar
                  image={eventInfo?.createdBy?.image}
                  name={eventInfo?.createdBy.name}
                  size="small"
                />
                <div>{eventInfo?.createdBy.name}</div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={deleteRecurringEvent} width="small">
        <ModalHeader>
          {translate('CALENDAR.DELETE_RECURRING_EVENT')}
        </ModalHeader>

        <ModalBody>
          <Radio
            options={[
              { value: '1', label: translate('CALENDAR.THIS_EVENT') },
              {
                value: '2',
                label: translate('CALENDAR.THIS_AND_THE_FOLLOWING_EVENTS'),
              },
              { value: '3', label: translate('CALENDAR.ALL_EVENTS') },
            ]}
            selected="1"
            onChange={value => setRecurringEventTypeExcluded(Number(value))}
          />

          <ButtonGroup placement="end">
            <Button
              title={translate('UI.CANCEL')}
              appearance="soft-link"
              onClick={() => setDeleteRecurringEvent(false)}
            />
            <Button
              title={translate('UI.DELETE')}
              appearance="primary"
              size="small"
              onClick={() => deleteEvent(eventInfo)}
            />
          </ButtonGroup>
        </ModalBody>
      </Modal>
    </AppPage>
  )
}

export default Calendar
