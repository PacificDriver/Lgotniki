import { createHash } from '../../utils/utils'
import db from '../database/db'

export const getAllFiles = async () => {
  const folders = await db.folders.toArray()
  const files = await db.files.toArray()

  return {
    folders: folders || [],
    files: files || [],
  }
}

export const getAllFolders = async () => {
  const folders = await db.folders.toArray()

  return folders || []
}

export const createFolder = async (name, hash = null) => {
  const newFolder = {
    hash: await createHash(name),
    name,
    fileCount: 0,
    size: 0,
    icon: '',
    files: [],
    subfolders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const createInFolder = async (folders, targetHash) => {
    for (const folder of folders) {
      if (folder.hash === targetHash) {
        if (!('subfolders' in folder)) folder.subfolders = []

        folder.subfolders.push(newFolder)
        return folders
      }

      if (folder?.subfolders?.length > 0) {
        const updatedFolders = await createInFolder(
          folder.subfolders,
          targetHash
        )
        if (updatedFolders) return folders
      }
    }
    return null
  }

  if (hash) {
    const folders = await getAllFolders()
    const data = await createInFolder(folders, hash)

    if (data) {
      await db.folders.bulkPut(data)
    } else {
      console.error('Hash não encontrada para a criação da subpasta.')
    }
  } else {
    await db.folders.add(newFolder)
  }
}

export const renameFolder = async (folderId, newName) => {
  const folder = await db.folders.get(folderId)

  if (!folder) {
    throw new Error('Folder not found')
  }

  folder.name = newName
  folder.updatedAt = new Date().toISOString()
  folder.hash = await createHash(`${folder.name}${folder.id}`, 12)

  await db.folders.put(folder)

  return folder
}

export const renameFile = async (fileId, newName) => {
  const file = await db.files.get(fileId)

  if (!file) {
    throw new Error('File not found')
  }

  file.name = newName
  file.updatedAt = new Date().toISOString()

  await db.files.put(file)

  return file
}

export const deleteFolder = async folderId => {
  const folder = await db.folders.get(folderId)

  if (!folder) {
    throw new Error('Folder not found')
  }

  if (folder.subfolders && folder.subfolders.length > 0) {
    for (const subfolder of folder.subfolders) {
      await deleteFolder(subfolder.id)
    }
  }

  const parentFolder = await db.folders
    .where('subfolders')
    .anyOf(folderId)
    .first()
  if (parentFolder) {
    parentFolder.subfolders = parentFolder.subfolders.filter(
      subfolderId => subfolderId !== folderId
    )
    await db.folders.put(parentFolder)
  }

  await db.folders.delete(folderId)
}

export const deleteFile = async fileId => {
  const file = await db.files.get(fileId)

  if (!file) {
    throw new Error('File not found')
  }

  await db.files.delete(fileId)
}
