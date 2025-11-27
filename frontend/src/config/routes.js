import React from 'react'

// System Pages
const Beneficiaries = React.lazy(() => import('../views/pages/Beneficiaries'))
const BeneficiaryDetail = React.lazy(
  () => import('../views/pages/Beneficiaries/Detail')
)
const BenefitTypes = React.lazy(() => import('../views/pages/BenefitTypes'))
const CalculationTasks = React.lazy(
  () => import('../views/pages/CalculationTasks')
)
const FileUpload = React.lazy(() => import('../views/pages/FileUpload'))
const AccountSettings = React.lazy(
  () => import('../views/pages/AccountSettings')
)
const Profile = React.lazy(() => import('../views/pages/Profile'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  {
    path: '/dashboard/beneficiaries',
    exact: true,
    name: 'Beneficiaries',
    element: Beneficiaries,
  },
  {
    path: '/dashboard/beneficiaries/:id',
    exact: true,
    name: 'BeneficiaryDetail',
    element: BeneficiaryDetail,
  },
  {
    path: '/dashboard/benefit-types',
    exact: true,
    name: 'BenefitTypes',
    element: BenefitTypes,
  },
  {
    path: '/dashboard/calculation-tasks',
    exact: true,
    name: 'CalculationTasks',
    element: CalculationTasks,
  },
  {
    path: '/dashboard/file-upload',
    exact: true,
    name: 'FileUpload',
    element: FileUpload,
  },
  {
    path: '/dashboard/account/settings',
    exact: true,
    name: 'AccountSettings',
    element: AccountSettings,
  },
  {
    path: '/dashboard/account/profile',
    exact: true,
    name: 'Profile',
    element: Profile,
  },
]

export default routes
