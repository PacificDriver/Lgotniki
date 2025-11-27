import moment from 'moment'
import { createContext, useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { isBlob } from '../utils/utils'

import { translate } from '../hooks/translate'
import { getAllChats } from '../services/chats'
import { addMessage, getMessagesBetween } from '../services/messages'

export const ChatContext = createContext({})

const guides = [
  { label: 'Chat', active: true },
  { label: translate('CHAT.GROUP'), active: false },
]

const getFirstAndLastName = value => {
  const parts = value?.split(' ')
  return `${parts?.[0]} ${parts?.[parts?.length - 1]}`
}

const formatDate = date => {
  const now = moment()
  const inputDate = moment(date)
  const diffInHours = now.diff(inputDate, 'hours')
  const diffInDays = now.diff(inputDate, 'days')

  if (diffInHours < 24) {
    return inputDate.format('HH:mm')
  }

  if (diffInDays === 1) {
    return 'Ontem'
  }

  return inputDate.format('DD/MM/YYYY')
}

const parseDate = dateStr => moment(dateStr, 'YYYY-MM-DD HH:mm:ss')

const ChatProvider = ({ children, data }) => {
  const [chats, setChats] = useState([])
  const [chatGroup, setChatGroup] = useState([])
  const [currentChat, setCurrentChat] = useState({})
  const [userInfo, setUserInfo] = useState({})
  const [users, setUsers] = useState([])
  const [groups, setGroups] = useState([])
  const [tabs, setTabs] = useState(guides)
  const [messages, setMessages] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [screenSize, setScreenSize] = useState(0)

  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadChats()
  }, [])

  useEffect(() => {
    if (params?.id && chats?.length) {
      const chat = chats.find(chat => chat.uuid === params.id)
      const chatIndex = chats.findIndex(chat => chat.uuid === params.id)

      setCurrentChat(chat || {})

      if (!chat) {
        navigate('/dashboard/chat', { replace: true })
      }

      if (!chatIndex === -1) return

      const values = chats

      values?.forEach(value => (value.selected = false))
      values[chatIndex].selected = true

      setChats(values)
    }
  }, [params?.id, chats])

  useEffect(() => {
    const formattedUsers = data?.users?.map(user => ({
      ...user,
      name: getFirstAndLastName(user?.name),
      label: getFirstAndLastName(user?.name),
      value: user?.id,
    }))
    setUsers(formattedUsers || [])
    setGroups(data?.groups || [])
    setChatGroup(data?.chatGroup || [])
  }, [data])

  useEffect(() => {
    const user = users.find(user => user?.id === currentChat?.user?.id)
    setUserInfo(user || {})
  }, [currentChat, users])

  useEffect(() => {
    loadMessages()
  }, [currentChat])

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

  useEffect(() => {
    const handlePopState = () => {
      setCurrentChat({})
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const loadChats = useCallback(async () => {
    let chats = await getAllChats()
    chats = chats
      ?.map(chat => ({
        ...chat,
        user: {
          ...chat.user,
          name: getFirstAndLastName(chat?.user?.name),
        },
        selected: false,
      }))
      .sort(
        (a, b) =>
          parseDate(b.createdAt).valueOf() - parseDate(a.createdAt).valueOf()
      )

    setChats(chats)
  }, [])

  const addNewChat = useCallback(async newChat => {
    newChat.user.name = getFirstAndLastName(newChat?.user?.name)
    setChats(prevChats => {
      const updatedChats = [...prevChats, newChat].sort(
        (a, b) =>
          parseDate(b.createdAt).valueOf() - parseDate(a.createdAt).valueOf()
      )
      return updatedChats
    })
  }, [])

  const sendMessage = useCallback(
    async message => {
      const createLink = message => {
        if (isBlob(message.content)) {
          message.content = URL.createObjectURL(message.content)
        }
        return message
      }

      await addMessage(message)

      setMessages(prevMessages => {
        const updatedMessages = [
          ...prevMessages.flatMap(group => group.messages),
          createLink(message),
        ]
        const groupedMessages = groupMessages(updatedMessages)
        return groupedMessages
      })

      setChats(prevChats => {
        const updatedChats = prevChats
          .map(chat => {
            if (chat.uuid === currentChat.uuid) {
              return {
                ...chat,
                content: {
                  message: message.content,
                  date: message.createdAt,
                  type: message.type,
                },
                createdAt: message.createdAt,
                unread: chat.unread,
              }
            }
            return chat
          })
          .sort(
            (a, b) =>
              parseDate(b.createdAt).valueOf() -
              parseDate(a.createdAt).valueOf()
          )

        return updatedChats
      })
    },
    [chats, currentChat]
  )

  const loadMessages = useCallback(async () => {
    if (!currentChat?.user?.id) return
    const messages = await getMessagesBetween(220, currentChat?.user?.id)

    setMessages(groupMessages(messages))
  }, [currentChat])

  const groupMessages = messages => {
    let groupedMessages = []
    let currentGroup = { type: '', messages: [] }

    messages?.forEach((message, index) => {
      if (index === 0) {
        currentGroup.type = message.type
        currentGroup.messages.push(message)
      } else {
        const prevMessage = messages[index - 1]
        const currentTime = new Date(message?.createdAt)
        const prevTime = new Date(prevMessage?.createdAt)
        const diffInMinutes = (currentTime - prevTime) / 1000 / 60

        if (message?.type === prevMessage?.type && diffInMinutes <= 1) {
          currentGroup.messages.push(message)
        } else {
          groupedMessages.push(currentGroup)
          currentGroup = { type: message.type, messages: [message] }
        }
      }
    })

    if (currentGroup.messages.length > 0) {
      groupedMessages.push(currentGroup)
    }

    return groupedMessages
  }

  const changeActiveTab = useCallback(
    index => {
      setTabs(prevTabs => {
        const updatedTabs = prevTabs.map((tab, i) => ({
          ...tab,
          active: i === index,
        }))
        return updatedTabs
      })
    },
    [tabs]
  )

  const handleChatSelection = (chatId, chatIndex) => {
    const items = chats
    items?.forEach(item => (item.selected = false))
    if (chatIndex) items[chatIndex].selected = true

    setChats(items)

    navigate(`/dashboard/chat/${chatId}`)
  }

  const handleChatBack = () => {
    navigate(-1)
    setCurrentChat({})
  }

  return (
    <ChatContext.Provider
      value={{
        chats,
        chatGroup,
        currentChat,
        users,
        groups,
        tabs,
        userInfo,
        messages,
        isMobile,
        screenSize,
        setChats,
        setCurrentChat,
        changeActiveTab,
        formatDate,
        addNewChat,
        sendMessage,
        handleChatSelection,
        handleChatBack,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
