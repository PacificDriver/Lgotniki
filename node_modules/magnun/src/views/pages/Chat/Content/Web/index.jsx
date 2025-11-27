import EmojiPicker from 'emoji-picker-react'
import moment from 'moment/moment'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MediaPreview } from 'react-view-files'

import { useChat } from '../../../../../hooks/useChat'
import useOutsideClick from '../../../../../hooks/useOutsideClick'

import IconButton from '../../../../../components/BaseUI/Button/IconButton'
import Avatar from '../../../../../components/CustomUI/Avatar'
import AudioRecorder from '../AudioRecorder'
import Received from '../Received'
import Sent from '../Sent'

import UserInfo from '../../UserInfo'

import { FiInfo, FiPhoneCall, FiVideo } from 'react-icons/fi'
import { IoIosSend } from 'react-icons/io'
import { IoAttachSharp, IoImageOutline } from 'react-icons/io5'
import {
  MdChevronLeft,
  MdMicNone,
  MdOutlineClose,
  MdOutlineEmojiEmotions,
} from 'react-icons/md'

import styles from '../Content.module.scss'

export default function Web({
  showIconBack = false,
  showIconInfo = false,
  className,
}) {
  const { currentChat, sendMessage, messages } = useChat()

  const [newMessage, setNewMessage] = useState({
    senderId: 220,
    receiverId: null,
    content: '',
    createdAt: null,
    read: false,
    deleted: false,
    type: 'sent',
  })

  const [showUserInfo, setShowUserInfo] = useState(false)

  const handleAddMessage = value => {
    const message = newMessage
    message.content = value
    message.receiverId = currentChat.user.id
    message.createdAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

    sendMessage(message)

    setNewMessage({
      senderId: 220,
      receiverId: null,
      content: '',
      createdAt: null,
      read: false,
      deleted: false,
      type: 'sent',
    })
  }

  return currentChat && Object.keys(currentChat || [])?.length > 0 ? (
    <div className={`${styles['content-container']} ${className && className}`}>
      {!showUserInfo ? (
        <>
          <ChatHeader
            showIconBack={showIconBack}
            showIconInfo={showIconInfo}
            setShowUserInfo={setShowUserInfo}
          />
          <ChatContent messages={messages} />
          <ChatInput onSave={value => handleAddMessage(value)} />
        </>
      ) : (
        <ChatInfo setShowUserInfo={setShowUserInfo} />
      )}
    </div>
  ) : (
    <div className={styles['content-container']}></div>
  )
}

const ChatHeader = ({ showIconBack, showIconInfo, setShowUserInfo }) => {
  const { currentChat, handleChatBack } = useChat()

  return (
    <div className={styles['header']}>
      <div className="d-flex align-items-center gap-1">
        {showIconBack && (
          <IconButton
            icon={<MdChevronLeft />}
            appearance="subtle"
            shape="circle"
            className={styles['header__back-icon']}
            onClick={handleChatBack}
          />
        )}

        <Avatar name={currentChat?.user?.name} src={currentChat?.user?.image} />

        <div className={styles['header__info']}>
          <span className={styles['name']}>{currentChat?.user?.name}</span>
          <span className={styles['status']}>
            {currentChat?.user?.active ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      <div className={styles['header__actions']}>
        <IconButton icon={<FiPhoneCall />} appearance="subtle" shape="circle" />
        <IconButton icon={<FiVideo />} appearance="subtle" shape="circle" />
        {showIconInfo && (
          <IconButton
            icon={<FiInfo />}
            appearance="subtle"
            shape="circle"
            onClick={() => setShowUserInfo(true)}
          />
        )}
      </div>
    </div>
  )
}

const ChatContent = ({ messages }) => {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }

  return (
    <div className={styles['content']}>
      {messages.map((messageGroup, index) => (
        <div key={index}>
          {messageGroup.type === 'sent' && (
            <Sent values={messageGroup.messages} />
          )}
          {messageGroup.type === 'received' && (
            <Received values={messageGroup.messages} />
          )}
        </div>
      ))}

      <div ref={messagesEndRef}></div>
    </div>
  )
}

const ChatInput = ({ onSave }) => {
  const [messageContent, setMessageContent] = useState('')
  const [audioMessage, setAudioMessage] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(null)
  const [previewFile, setPreviewFile] = useState()

  const actionsRef = useRef(null)

  const handleAudioMessage = () => {
    setAudioMessage(true)
  }

  const getEmoji = event => {
    handleChangeEmoji(event.emoji)
  }

  const handleChangeEmoji = useCallback(
    emoji => {
      const getValue = insertAt(messageContent, emoji, cursorPosition)

      setMessageContent(getValue)
    },
    [cursorPosition, messageContent]
  )

  const insertAt = (target, newString, pos) => {
    if (typeof pos == 'undefined') pos = 0
    if (typeof newString == 'undefined') newString = ''

    return target.slice(0, pos) + newString + target.slice(pos)
  }

  const handleClickInput = useCallback(e => {
    setCursorPosition(e.target.selectionStart)
  }, [])

  const autoResize = e => {
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'

    actionsRef.current.style.height = e.target.scrollHeight + 'px'
  }

  const uploadMedia = () => document.getElementById('uploadMedia').click()
  const uploadDocs = () => document.getElementById('uploadDocs').click()

  const handleFileSelection = file => {
    setPreviewFile(file)
    setMessageContent(file)
  }

  const handleSave = () => {
    onSave?.(messageContent)
    setMessageContent('')
    setPreviewFile()
  }

  return (
    <>
      <div
        className={`${styles['input']} ${
          audioMessage && styles['input__audio-message']
        }`}
      >
        {!audioMessage ? (
          <>
            <div className={styles['input__content']}>
              <textarea
                rows={1}
                placeholder="Type a message..."
                className={styles['input-text']}
                value={messageContent}
                onChange={event => setMessageContent(event.target.value)}
                onClick={event => handleClickInput(event)}
                onBlur={event => handleClickInput(event)}
                onInput={event => autoResize(event)}
              />
            </div>

            <div className={styles['actions']} ref={actionsRef}>
              <div className={styles['actions__items']}>
                <IoImageOutline onClick={uploadMedia} />
                <IoAttachSharp onClick={uploadDocs} />
                <MdMicNone onClick={handleAudioMessage} />
                <MdOutlineEmojiEmotions
                  onClick={() => setShowEmojiPicker(true)}
                />

                <span
                  className={styles['actions__items__button-send']}
                  onClick={handleSave}
                >
                  <IoIosSend />
                </span>
              </div>
            </div>

            <input
              type="file"
              id="uploadMedia"
              hidden
              accept="image/*,video/*,audio/*"
              onChange={event => handleFileSelection(event.target.files[0])}
            />
            <input
              type="file"
              id="uploadDocs"
              hidden
              accept=".pdf,.doc,.docx,.txt"
              onChange={event => handleFileSelection(event.target.files[0])}
            />
          </>
        ) : (
          <div className={styles['input__audio-recorder']}>
            <AudioRecorder
              init={audioMessage}
              onCancel={() => setAudioMessage(false)}
              onSend={value => onSave?.(value)}
            />
          </div>
        )}
      </div>

      {previewFile && (
        <ChatMediaPreview
          previewFile={previewFile}
          setPreviewFile={setPreviewFile}
          setMessageContent={setMessageContent}
          onSave={() => handleSave()}
        />
      )}

      {showEmojiPicker && (
        <ChatEmojiPicker
          setShowEmojiPicker={setShowEmojiPicker}
          getEmoji={getEmoji}
        />
      )}
    </>
  )
}

const ChatMediaPreview = ({
  previewFile,
  setPreviewFile,
  setMessageContent,
  onSave,
}) => {
  const clearFile = () => {
    setPreviewFile()
    setMessageContent('')
  }

  return (
    <div className={styles['media-view']}>
      <div className={styles['media-view__header']}>
        <IconButton
          icon={<MdOutlineClose />}
          shape="circle"
          appearance="subtle"
          className={styles['close']}
          onClick={clearFile}
        />

        <span className={styles['title']}>{previewFile?.name}</span>
      </div>

      <MediaPreview
        file={previewFile}
        hideFooter={true}
        className={styles['media-view__preview']}
        style={{
          width: '363px',
          height: '242px',
        }}
      />

      <div className={styles['media-view__footer']}>
        <span className={styles['button-send']} onClick={onSave}>
          <IoIosSend />
        </span>
      </div>
    </div>
  )
}

const ChatEmojiPicker = ({ setShowEmojiPicker, getEmoji }) => {
  const emojiRef = useRef(null)

  useOutsideClick(emojiRef, () => {
    setShowEmojiPicker(false)
  })

  return (
    <div ref={emojiRef} className={styles['emoji-picker']}>
      <EmojiPicker
        width={300}
        height={350}
        searchDisabled={true}
        onEmojiClick={event => getEmoji(event)}
        emojiStyle="google"
        previewConfig={{ showPreview: false }}
      />
    </div>
  )
}

const ChatInfo = ({ setShowUserInfo }) => {
  return (
    <div className={styles['chat-info']}>
      <UserInfo onBack={() => setShowUserInfo(false)} />
    </div>
  )
}
