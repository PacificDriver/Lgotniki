import db from '../database/db'

export const getAllInvoices = async () => {
  const invoices = await db.invoices.toArray()
  const users = await db.users.toArray()

  const userMap = users.reduce((acc, user) => {
    acc[user.id] = user
    return acc
  }, {})

  const mappedInvoices = invoices.map(invoice => {
    const user = userMap[invoice.userId]
    return {
      ...invoice,
      user: {
        name: user ? user.name : 'Usuário desconhecido',
        image: user ? user.image : null,
      },
    }
  })

  const sortedTransactions = mappedInvoices.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  return sortedTransactions
}

export const getInvoicesByLimit = async (limit = 15) => {
  const transactions = await getAllInvoices()

  return transactions.slice(0, limit)
}
