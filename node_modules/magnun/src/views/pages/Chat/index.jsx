import React, { useEffect, useState } from 'react'

import ChatProvider from '../../../contexts/chat'

import { getAllUsers } from '../../../services/users'

import AppPage from '../../../components/CustomUI/AppPage'
import Content from './Wrapper'

import styles from './Chat.module.scss'

const Chat = () => {
  const [chatGroup, setChatGroup] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const users = await getAllUsers()

      setChatGroup(chatGroup)
      setUsers(users)
    }

    fetchData()
  }, [])

  return (
    <AppPage className={styles['chat-container']}>
      <ChatProvider data={{ users: users }}>
        <Content />
      </ChatProvider>
    </AppPage>
  )
}

export default Chat
