import db from '../database/db'

export const getAllTransactions = async () => {
  const transactions = await db.transactions.toArray()
  const users = await db.users.toArray()

  const userMap = users.reduce((acc, user) => {
    acc[user.id] = user
    return acc
  }, {})

  const mappedTransactions = transactions.map(transaction => {
    const user = userMap[transaction.userId]
    return {
      ...transaction,
      user: {
        name: user ? user.name : 'Usuário desconhecido',
        image: user ? user.image : null,
      },
    }
  })

  const sortedTransactions = mappedTransactions.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  return sortedTransactions
}

export const getTransactionsByLimit = async (limit = 15) => {
  const transactions = await getAllTransactions()

  return transactions.slice(0, limit)
}
