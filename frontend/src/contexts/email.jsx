import React, { createContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'

export const EmailContext = createContext()

export const EmailProvider = ({ children, data: items, emailActions }) => {
  const [emails, setEmails] = useState([])
  const [data, setData] = useState([])
  const [currentSidebar, setCurrentSidebar] = useState('inbox')
  const [actions, setActions] = useState(emailActions)
  const [showEmailDetails, setShowEmailDetails] = useState(false)
  const [currentEmail, setCurrentEmail] = useState({})
  const [allEmailsSelected, setAllEmailsSelected] = useState(false)
  const [anyEmailSelected, setAnyEmailSelected] = useState(false)
  const [createEmail, setCreateEmail] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [screenSize, setScreenSize] = useState(0)
  const [currentSidebarName, setCurrentSidebarName] = useState(
    emailActions[0].name
  )

  const params = useParams()

  useEffect(() => {
    if (params?.id) {
      setShowEmailDetails(true)

      const email = data.find(email => email.uuid === params.id)
      setCurrentEmail(email || {})
    }
  }, [data, params])

  useEffect(() => setData(items), [items])

  useEffect(() => {
    const filtered = data?.filter(
      email => email.type === currentSidebar || email?.status?.[currentSidebar]
    )
    setEmails(filtered)
    setCurrentSidebarName(
      actions?.find(action => action?.type === currentSidebar)?.name
    )
  }, [currentSidebar, data])

  useEffect(() => {
    const updateActions = () => {
      const updatedActions = emailActions?.map(action => {
        const unreadCount = data?.filter(
          email => email.type === action.type && !email.status.read
        ).length
        return { ...action, quantity: unreadCount }
      })

      setActions(updatedActions)
    }

    updateActions()
  }, [data, emailActions])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 991.88)
      setScreenSize(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleEmailClick = emailId => {
    const updatedEmails = emails?.map(email =>
      email.id === emailId
        ? { ...email, status: { ...email.status, read: true } }
        : email
    )

    setEmails(updatedEmails)

    const updatedData = data?.map(email =>
      email.id === emailId
        ? { ...email, status: { ...email.status, read: true } }
        : email
    )

    setData(updatedData)

    setShowEmailDetails(true)
    setCurrentEmail(updatedEmails?.find(email => email.id === emailId))

    const updateActions = () => {
      const updatedActions = emailActions?.map(action => {
        const unreadCount = updatedData?.filter(
          email => email.type === action.type && !email.status.read
        ).length
        return { ...action, quantity: unreadCount }
      })

      setActions(updatedActions)
    }

    updateActions()
  }

  const formatDate = value => {
    const date = moment(value)
    const now = moment()
    const difference = now.diff(date, 'days')

    if (difference === 0) return date.format('HH:mm')
    if (difference <= 365)
      return `${date.format('DD')} de ${date.format('MMM')}`

    return date.format('DD/MM/YYYY')
  }

  const showEmailList = () => {
    setShowEmailDetails(false)
    setCurrentEmail({})
  }

  const toggleStarredEmail = (event, emailId) => {
    event.stopPropagation()

    const updatedEmails = emails?.map(email =>
      email.id === emailId
        ? {
            ...email,
            status: { ...email.status, starred: !email.status.starred },
          }
        : email
    )

    setEmails(updatedEmails)

    const updatedData = data?.map(email =>
      email.id === emailId
        ? {
            ...email,
            status: { ...email.status, starred: !email.status.starred },
          }
        : email
    )

    setData(updatedData)

    setCurrentEmail(updatedEmails?.find(email => email.id === emailId))
  }

  const toggleSelectEmail = (event, emailId) => {
    event.stopPropagation()

    const updatedEmails = emails?.map(email =>
      email.id === emailId
        ? {
            ...email,
            status: { ...email.status, selected: !email.status.selected },
          }
        : email
    )

    setEmails(updatedEmails)

    const updatedData = data?.map(email =>
      email.id === emailId
        ? {
            ...email,
            status: { ...email.status, selected: !email.status.selected },
          }
        : email
    )

    setData(updatedData)

    setAnyEmailSelected(updatedEmails?.some(email => email.status.selected))
  }

  const markAllEmails = (event, pagination) => {
    event.stopPropagation()

    const visibleEmails = emails?.slice(
      pagination?.offset,
      pagination?.offset + pagination?.itemsPerPage
    )

    const updatedEmails = emails?.map(email =>
      visibleEmails.includes(email)
        ? {
            ...email,
            status: {
              ...email.status,
              selected: anyEmailSelected ? false : !email?.status?.selected,
            },
          }
        : email
    )

    setEmails(updatedEmails)

    const updatedData = data?.map(email =>
      visibleEmails.includes(email)
        ? {
            ...email,
            status: {
              ...email.status,
              selected: anyEmailSelected ? false : !email?.status?.selected,
            },
          }
        : email
    )

    const paginatedData = updatedEmails?.slice(
      pagination?.offset,
      pagination?.offset + pagination?.itemsPerPage
    )

    const selectedAll = paginatedData?.every(email => email.status.selected)
    const anySelected = paginatedData?.some(email => email.status.selected)

    setData(updatedData)
    setAllEmailsSelected(selectedAll)
    setAnyEmailSelected(selectedAll ? false : anySelected)
  }

  return (
    <EmailContext.Provider
      value={{
        emails,
        currentSidebar,
        actions,
        showEmailDetails,
        currentEmail,
        allEmailsSelected,
        anyEmailSelected,
        createEmail,
        isMobile,
        screenSize,
        currentSidebarName,
        setEmails,
        setCurrentSidebar,
        handleEmailClick,
        showEmailList,
        formatDate,
        toggleStarredEmail,
        toggleSelectEmail,
        markAllEmails,
        setCreateEmail,
      }}
    >
      {children}
    </EmailContext.Provider>
  )
}
