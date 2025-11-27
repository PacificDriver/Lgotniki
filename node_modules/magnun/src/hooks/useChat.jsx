import { useContext } from 'react'

import { ChatContext } from '../contexts/chat'

export const useChat = () => {
  const {
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
  } = useContext(ChatContext)

  return {
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
  }
}
