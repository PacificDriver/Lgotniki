import {
  FiUsers,
  FiTag,
  FiFileText,
  FiUpload,
  FiSettings,
  FiSliders,
} from 'react-icons/fi'

const navigation = [
  {
    items: [
      {
        name: 'Реестр льготников',
        url: '/dashboard/beneficiaries',
        icon: <FiUsers />,
      },
      {
        name: 'Типы льгот',
        url: '/dashboard/benefit-types',
        icon: <FiTag />,
      },
      {
        name: 'Задачи расчета',
        url: '/dashboard/calculation-tasks',
        icon: <FiFileText />,
      },
      {
        name: 'Загрузка данных',
        url: '/dashboard/file-upload',
        icon: <FiUpload />,
      },
      {
        name: 'Настройки системы',
        url: '/dashboard/settings',
        icon: <FiSliders />,
      },
      {
        name: 'Настройки пользователя',
        url: '/dashboard/account/settings',
        icon: <FiSettings />,
      },
    ],
  },
]

export default navigation
