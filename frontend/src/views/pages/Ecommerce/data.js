import { translate } from '../../../hooks/translate'
import {
  MdOutlineLocalMall,
  MdOutlineAccountBalanceWallet,
  MdOutlineInventory2,
  MdAccountBalance,
  MdCreditCard,
} from 'react-icons/md'

const cardInfo = [
  {
    title: translate('Campanhas enviadas'),
    type: 'number',
    value: 2839,
    percentage: 27.34,
    icon: <MdOutlineLocalMall />,
    money: true,
    appearance: 'success',
  },
  {
    title: translate('Novos leads'),
    type: 'number',
    value: 1827,
    percentage: -1.64,
    icon: <MdOutlineAccountBalanceWallet />,
    money: true,
    appearance: 'danger',
  },
  {
    title: translate('Average Contract'),
    type: 'money',
    value: 39427.82,
    percentage: 9.34,
    icon: <MdOutlineInventory2 />,
    money: true,
    appearance: 'warning',
  },
]

const filterOptions = [
  { value: 'd', name: translate('UI.TODAY') },
  { value: 'w', name: translate('UI.WEEK') },
  { value: 'm', name: translate('UI.MONTH') },
  { value: 'a', name: translate('UI.YEAR') },
]

const headersTransaction = [
  { name: translate('UI.NAME'), dataType: 'text' },
  { name: translate('Date & Time'), dataType: 'date' },
  { name: translate('Transaction'), dataType: 'between' },
  { name: translate('Amount'), dataType: 'between' },
  { name: translate('People In Change'), dataType: 'option' },
  { name: translate('UI.STATUS'), dataType: 'option' },
]

const transactionsIcons = {
  'Bank Transfer': <MdAccountBalance />,
  'Credit Card': <MdCreditCard />,
}

function generateRandomData(length, min = 0, max = 100) {
  return Array.from(
    { length },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  )
}

function getMonthsOfYear() {
  const months = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(now.getFullYear(), i)
    let month = monthDate.toLocaleDateString('default', { month: 'short' })
    month = month.charAt(0).toUpperCase() + month.slice(1).replace('.', '')
    months.push(month)
  }
  return months
}

function getWeeksOfMonth() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const weeks = []
  for (
    let d = new Date(startOfMonth);
    d.getMonth() === now.getMonth();
    d.setDate(d.getDate() + 7)
  ) {
    weeks.push(`Week ${Math.ceil(d.getDate() / 7)}`)
  }
  return weeks
}

function getLast7Years() {
  const years = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    years.push((now.getFullYear() - i).toString())
  }
  return years
}

function getDailyHours() {
  const hours = []

  for (let i = 0; i < 13; i++) {
    const hour = (i * 2) % 24
    const hour12 =
      (hour % 12 === 0 ? 12 : hour % 12) + (hour < 12 ? ' AM' : ' PM')
    hours.push(hour12)
  }

  return hours
}

const lifetimeSalesData = {
  daily: {
    categories: getDailyHours(),
    series: [
      {
        name: translate('UI.SALES'),
        data: generateRandomData(getDailyHours().length, 0, 20000),
        typeOfInformation: 'money',
      },
      {
        name: translate('UI.INCOME'),
        data: generateRandomData(getDailyHours().length, 0, 20000),
        typeOfInformation: 'money',
      },
      {
        name: translate('UI.REVENUE'),
        data: generateRandomData(getDailyHours().length, 0, 20000),
        typeOfInformation: 'money',
      },
    ],
  },
  weekly: {
    categories: getWeeksOfMonth(),
    series: [
      {
        name: translate('UI.SALES'),
        data: generateRandomData(getWeeksOfMonth().length, 0, 100000),
        typeOfInformation: 'money',
      },
      {
        name: translate('UI.INCOME'),
        data: generateRandomData(getWeeksOfMonth().length, 0, 100000),
        typeOfInformation: 'money',
      },
      {
        name: translate('UI.REVENUE'),
        data: generateRandomData(getWeeksOfMonth().length, 0, 100000),
        typeOfInformation: 'money',
      },
    ],
  },
  monthly: {
    categories: getMonthsOfYear(),
    series: [
      {
        name: translate('UI.SALES'),
        data: generateRandomData(getMonthsOfYear().length, 0, 500000),
        typeOfInformation: 'money',
      },
      {
        name: translate('UI.INCOME'),
        data: generateRandomData(getMonthsOfYear().length, 0, 500000),
        typeOfInformation: 'money',
      },
      {
        name: translate('UI.REVENUE'),
        data: generateRandomData(getMonthsOfYear().length, 0, 500000),
        typeOfInformation: 'money',
      },
    ],
  },
  annually: {
    categories: getLast7Years(),
    series: [
      {
        name: translate('UI.SALES'),
        data: generateRandomData(getLast7Years().length, 0, 100000000),
        typeOfInformation: 'money',
      },
      {
        name: translate('UI.INCOME'),
        data: generateRandomData(getLast7Years().length, 0, 100000000),
        typeOfInformation: 'money',
      },
      {
        name: translate('UI.REVENUE'),
        data: generateRandomData(getLast7Years().length, 0, 100000000),
        typeOfInformation: 'money',
      },
    ],
  },
}

export {
  cardInfo,
  filterOptions,
  headersTransaction,
  lifetimeSalesData,
  transactionsIcons,
}
