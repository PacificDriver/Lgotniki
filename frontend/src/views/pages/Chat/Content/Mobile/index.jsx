import React from 'react'

import { useChat } from '../../../../../hooks/useChat'

import Content from './Content'
import Chats from './Chats'

export default function Mobile() {
  const { currentChat } = useChat()

  return (
    <>{Object.keys(currentChat || [])?.length > 0 ? <Content /> : <Chats />}</>
  )
}
