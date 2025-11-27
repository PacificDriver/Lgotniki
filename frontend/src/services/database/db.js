import Dexie from 'dexie'

const db = new Dexie('AteroDashboard')

db.version(1).stores({
  users: '++id, name, image, active, email, bio',
  messages:
    '++id, uuid, senderId, receiverId, content, createdAt, read, deleted, type',
  emails:
    '++id, uuid, sender, recipient, subject, message, date, type, attachments, status',
  folders:
    '++id, hash, name, fileCount, size, icon, files, subfolders, createdAt, updatedAt',
  files: '++id, name, type, url, createdAt, updatedAt',
  transactions:
    '++id, name, transactionType, amount, userId, status, image, createdAt',
  invoices: '++id, number, status, userId, total, amountDue, createdAt',
})

export default db
