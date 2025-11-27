import db from '../database/db'

export const getAllUsers = async () => {
  return await db.users.toArray()
}

export const getUserById = async id => {
  return await db.users.get(id)
}

export const addUser = async user => {
  return await db.users.add(user)
}

export const updateUser = async (id, updatedUser) => {
  return await db.users.update(id, updatedUser)
}

export const deleteUser = async id => {
  return await db.users.delete(id)
}
