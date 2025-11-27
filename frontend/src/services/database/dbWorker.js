/* eslint-disable no-restricted-globals */

import { createHash } from '../../utils/utils'
import db from './db'

const generateHashForFolders = async folders => {
  for (const folder of folders) {
    folder.hash = await createHash(`${folder?.name}${folder?.id}`, 12)
    if (folder.subfolders && folder.subfolders.length > 0) {
      folder.subfolders = await generateHashForFolders(folder.subfolders)
    }
  }
  return folders
}

// Check if the database is empty
const isDbEmpty = async () => {
  const tables = [
    db.users,
    db.messages,
    db.emails,
    db.folders,
    db.files,
    db.transactions,
    db.invoices,
  ]
  const counts = await Promise.all(tables.map(table => table.count()))
  return counts.every(count => count === 0)
}

// Function to initialize bank in batches with adjustable pauses
const initializeDbInBatches = async (
  initialData,
  batchSize = 50,
  initialDelay = 50
) => {
  let delay = initialDelay
  for (const table in initialData) {
    const data = initialData[table]
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)

      const start = performance.now()
      await db[table].bulkAdd(batch)
      const end = performance.now()

      // Pause adjustment based on batch execution time
      if (end - start > 30) {
        delay = Math.min(delay + 10, 100) // Increase up to 100ms
      } else {
        delay = Math.max(delay - 5, 50) // Decreases up to 50ms
      }

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

// Initialize the database with initial data
const initializeDb = async initialData => {
  try {
    const dbEmpty = await isDbEmpty()

    if (dbEmpty) {
      // Prepare folders with hashes if necessary
      if (initialData.folders) {
        initialData.folders = await generateHashForFolders(initialData.folders)
      }

      // Starts inserting data in batches with dynamic pauses
      await initializeDbInBatches(initialData)
    }
    self.postMessage('Database initialized')
  } catch (error) {
    console.error('Error initializing database:', error)
    self.postMessage('Error initializing')
  }
}

// Listener to receive data from the main component
self.onmessage = async event => {
  const initialData = event.data
  await initializeDb(initialData)
}
