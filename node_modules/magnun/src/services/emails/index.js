import db from '../database/db'

export const getAllEmails = async () => {
  return await db.emails.toArray()
}

export const getEmailById = async id => {
  return await db.emails.get(id)
}

export const addEmail = async email => {
  return await db.emails.add(email)
}

export const updateEmail = async (id, updatedEmail) => {
  return await db.emails.update(id, updatedEmail)
}

export const deleteEmail = async id => {
  return await db.emails.delete(id)
}
