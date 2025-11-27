import React from 'react'

import { translate } from '../../../../hooks/translate'

import Checkbox from '../../../../components/BaseUI/Checkbox'
import { Table, Td, Tr } from '../../../../components/BaseUI/Table'

export default function Notifications() {
  const headers = [
    { name: translate('ACCOUNT_SETTINGS.TYPE'), width: 650 },
    { name: 'E-mail', width: 100 },
    { name: 'SMS', width: 100 },
    { name: 'Push', width: 100 },
  ]

  const notifications = [
    {
      type: 'New login detected from an unknown device',
      email: true,
      sms: true,
      push: true,
    },
    {
      type: 'Login attempt blocked due to incorrect password',
      email: true,
      sms: false,
      push: true,
    },
    {
      type: 'Unusual activity alert on your account',
      email: true,
      sms: true,
      push: true,
    },
    {
      type: 'Password update successfully completed',
      email: true,
      sms: true,
      push: false,
    },
    { type: 'Password reset request', email: true, sms: true, push: true },
    {
      type: 'Two-factor authentication enabled',
      email: true,
      sms: true,
      push: false,
    },
    {
      type: 'Device disconnected from your account',
      email: true,
      sms: false,
      push: true,
    },
    {
      type: 'Alert: Attempted access from an unrecognized location',
      email: true,
      sms: true,
      push: true,
    },
    {
      type: 'Access revoked from a connected external app',
      email: true,
      sms: false,
      push: true,
    },
    {
      type: 'Identity verification required to continue',
      email: true,
      sms: true,
      push: false,
    },
  ]

  return (
    <div className="px-3">
      <h4 className="title-page">{translate('Notifications')}</h4>
      <p className="sub-title-page mb-5">
        Manage your notifications and choose how you want to receive important
        alerts, customizing preferences for email, SMS, or push for each
        category.
      </p>

      <Table
        columns={headers}
        tableId="notifications-list"
        className="card-content"
        disableColumnMenu
        disableExport
        hideFooter
        disableColumnFilter
        disableColumnResize
      >
        {notifications?.map((notification, index) => (
          <Tr key={index} id={index}>
            <Td>{notification?.type}</Td>
            <Td>
              <Checkbox isChecked={notification?.email} />
            </Td>
            <Td>
              <Checkbox isChecked={notification?.sms} />
            </Td>
            <Td>
              <Checkbox isChecked={notification?.push} />
            </Td>
          </Tr>
        ))}
      </Table>
    </div>
  )
}
