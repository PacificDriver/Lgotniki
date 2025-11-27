import db from '../database/db'
import formatter from './formatter'

export const getAllMessages = async () => {
  return await db.messages.toArray()
}

export const getMessageById = async id => {
  return await db.messages.get(id)
}

export const getMessagesBetween = async (senderId, receiverId) => {
  const messages = await db.messages
    .filter(
      message =>
        (message.senderId === senderId && message.receiverId === receiverId) ||
        (message.senderId === receiverId && message.receiverId === senderId)
    )
    .toArray()

  return messages?.map(message => ({
    ...message,
    content: formatter(message?.content),
  }))
}

export const addMessage = async message => {
  return await db.messages.add(message)
}

export const updateMessage = async (id, updatedMessage) => {
  return await db.messages.update(id, updatedMessage)
}

export const deleteMessage = async id => {
  return await db.messages.delete(id)
}
