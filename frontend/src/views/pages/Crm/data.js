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

const satisficationOptions = [
  { value: 'currentWeek', name: translate('Semana atual') },
  { value: 'lastWeek', name: translate('Ultima semana') },
]

const topTrafficData = {
  categories: [
    {
      name: 'Google',
      image: require('../../../assets/icons/google.png'),
      color: '#8c62ff',
    },
    {
      name: 'Bing',
      image: require('../../../assets/icons/bing.png'),
      color: '#0caf60',
    },
    {
      name: 'Safari',
      percentage: 28.52,
      image: require('../../../assets/icons/safari.png'),
      color: '#0062ff',
    },
  ],
  dataset: {
    currentWeek: [78.28, 52.14, 28.52],
    lastWeek: [54.89, 62.37, 41.72],
  },
}

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

// Função para obter horários específicos do dia
function getDailyHours() {
  return [
    '09 AM',
    '10 AM',
    '11 AM',
    '12 PM',
    '1 PM',
    '2 PM',
    '3 PM',
    '4 PM',
    '5 PM',
    '6 PM',
  ]
}

const totalSalesData = {
  daily: {
    categories: getDailyHours(),
    series: [
      {
        name: 'Direct',
        data: generateRandomData(getDailyHours().length, 0, 10000),
        typeOfInformation: 'money',
      },
      {
        name: 'Organic Search',
        data: generateRandomData(getDailyHours().length, 0, 10000),
        typeOfInformation: 'money',
      },
      {
        name: 'Social',
        data: generateRandomData(getDailyHours().length, 0, 10000),
        typeOfInformation: 'money',
      },
    ],
  },
  weekly: {
    categories: getWeeksOfMonth(),
    series: [
      {
        name: 'Direct',
        data: generateRandomData(getWeeksOfMonth().length, 0, 1000000),
        typeOfInformation: 'money',
      },
      {
        name: 'Organic Search',
        data: generateRandomData(getWeeksOfMonth().length, 0, 1000000),
        typeOfInformation: 'money',
      },
      {
        name: 'Social',
        data: generateRandomData(getWeeksOfMonth().length, 0, 1000000),
        typeOfInformation: 'money',
      },
    ],
  },
  monthly: {
    categories: getMonthsOfYear(),
    series: [
      {
        name: 'Direct',
        data: generateRandomData(getMonthsOfYear().length, 0, 1000000),
        typeOfInformation: 'money',
      },
      {
        name: 'Organic Search',
        data: generateRandomData(getMonthsOfYear().length, 0, 1000000),
        typeOfInformation: 'money',
      },
      {
        name: 'Social',
        data: generateRandomData(getMonthsOfYear().length, 0, 1000000),
        typeOfInformation: 'money',
      },
    ],
  },
  annually: {
    categories: getLast7Years(),
    series: [
      {
        name: 'Direct',
        data: generateRandomData(getLast7Years().length, 0, 10000000),
        typeOfInformation: 'money',
      },
      {
        name: 'Organic Search',
        data: generateRandomData(getLast7Years().length, 0, 10000000),
        typeOfInformation: 'money',
      },
      {
        name: 'Social',
        data: generateRandomData(getLast7Years().length, 0, 10000000),
        typeOfInformation: 'money',
      },
    ],
  },
}

const satisficationData = {
  lastWeek: {
    categories: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    series: [
      {
        name: 'Satisfied',
        data: generateRandomData(7, 0, 5),
      },
      {
        name: 'Neutral',
        data: generateRandomData(7, 0, 5),
      },
      {
        name: 'Dissatisfied',
        data: generateRandomData(7, 0, 5),
      },
    ],
  },
  currentWeek: {
    categories: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    series: [
      {
        name: 'Satisfied',
        data: generateRandomData(7, 0, 5),
      },
      {
        name: 'Neutral',
        data: generateRandomData(7, 0, 5),
      },
      {
        name: 'Dissatisfied',
        data: generateRandomData(7, 0, 5),
      },
    ],
  },
}

const incomeAndExpansesdata = {
  categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  series: [
    {
      name: 'Income',
      data: generateRandomData(6, 0, 10000),
      typeOfInformation: 'money',
    },
    {
      name: 'Expanses',
      data: generateRandomData(6, 0, 10000),
      typeOfInformation: 'money',
    },
  ],
}

export {
  cardInfo,
  filterOptions,
  satisficationOptions,
  totalSalesData,
  satisficationData,
  topTrafficData,
  headersTransaction,
  transactionsIcons,
  incomeAndExpansesdata,
}
