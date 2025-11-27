import db from '../database/db'

import { createHash, getFile } from '../../utils/utils'

import {
  FaImage,
  FaRegFileAlt,
  FaRegFileExcel,
  FaRegFilePdf,
  FaRegFileWord,
} from 'react-icons/fa'
import { MdOutlineMic, MdVideocam } from 'react-icons/md'

const getFileIcon = mimeType => {
  if (mimeType.startsWith('audio'))
    return <MdOutlineMic style={{ fontSize: '15px' }} />
  if (mimeType.startsWith('image')) return <FaImage />
  if (mimeType.startsWith('video'))
    return <MdVideocam style={{ fontSize: '15px' }} />
  if (mimeType === 'application/pdf') return <FaRegFilePdf />
  if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
    return <FaRegFileWord />
  if (mimeType === 'text/plain') return <FaRegFileAlt />
  if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
    return <FaRegFileExcel />
  return <span>📁</span>
}

const formatContentMessage = async content => {
  if (content instanceof Blob || isValidUrl(content)) {
    const fileUrl =
      content instanceof Blob ? URL.createObjectURL(content) : content
    const fileData = await getFile(fileUrl)

    if (fileData?.headers) {
      const mimeType = fileData.headers.contentType
      const icon = getFileIcon(mimeType)
      const label = mimeType.startsWith('audio')
        ? 'Audio'
        : mimeType.startsWith('image')
          ? 'Foto'
          : mimeType.startsWith('video')
            ? 'Vídeo'
            : mimeType === 'application/pdf'
              ? 'PDF'
              : mimeType ===
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ? 'Word'
                : mimeType === 'text/plain'
                  ? 'Documento de texto'
                  : mimeType ===
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    ? 'Excel'
                    : 'Arquivo'

      return (
        <div className="d-flex align-items-center" style={{ gap: '6px' }}>
          {icon} {label}
        </div>
      )
    }
  }
  return content
}

export const getAllChats = async () => {
  const messages = await db.messages.toArray()
  const users = await db.users.toArray()

  const lastMessages = messages.reduce((acc, message) => {
    const otherUserId =
      message.senderId === 220 ? message.receiverId : message.senderId
    if (
      !acc[otherUserId] ||
      new Date(message.createdAt) > new Date(acc[otherUserId].createdAt)
    ) {
      acc[otherUserId] = message
    }
    return acc
  }, {})

  const userMap = users.reduce((acc, user) => {
    acc[user.id] = user
    return acc
  }, {})

  const chats = await Promise.all(
    Object.keys(lastMessages).map(async userId => {
      const message = lastMessages[userId]
      const user = userMap[userId]

      const unreadCount = await db.messages
        .filter(
          m =>
            m.receiverId === parseInt(userId) &&
            !m.read &&
            m.type === 'received'
        )
        .count()

      const contentMessage = await formatContentMessage(
        message.content,
        message.duration
      )

      return {
        uuid: await createHash(user?.id),
        user: {
          name: user.name,
          image: user.image,
          id: user.id,
          active: user.active,
        },
        unread: unreadCount,
        content: {
          message: contentMessage,
          date: message.createdAt,
          type: message.type,
        },
        createdAt: message.createdAt,
      }
    })
  )

  return chats
}

const isValidUrl = url => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
