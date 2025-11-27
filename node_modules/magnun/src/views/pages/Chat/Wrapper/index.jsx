import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { useChat } from '../../../../hooks/useChat'

import UserInfo from '../UserInfo'
import ListUsers from '../ListUsers'
import EmptyContent from '../EmptyContent'

import styles from './Wrapper.module.scss'
import Chats from '../Content/Mobile/Chats'

export default function Wrapper() {
  const { currentChat, isMobile } = useChat()
  const [wrapperStyle, setwrapperStyle] = useState(null)
  const [hasChat, setHasChat] = useState(false)

  useEffect(() => {
    setHasChat(Object.keys(currentChat || [])?.length > 0)

    if (isMobile) {
      setwrapperStyle({ gridTemplateColumns: '1fr' })

      return
    }

    setwrapperStyle({
      gridTemplateColumns: Object.keys(currentChat || [])?.length
        ? '300px 1fr 250px'
        : '300px 1fr',
    })
  }, [currentChat, isMobile])

  return (
    <div
      className={styles['wrapper']}
      style={{ ...wrapperStyle, ...(isMobile && { padding: '0' }) }}
    >
      {isMobile ? <Chats /> : <ListUsers />}
      {hasChat ? <Outlet /> : !isMobile && <EmptyContent />}
      {hasChat && !isMobile && <UserInfo />}
    </div>
  )
}
