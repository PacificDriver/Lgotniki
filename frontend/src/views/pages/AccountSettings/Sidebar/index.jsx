import React, { useState } from 'react'

import { translate } from '../../../../hooks/translate'

import { MdOutlinePersonOutline } from 'react-icons/md'
import { MdOutlineSettings } from 'react-icons/md'
import { MdLockOutline } from 'react-icons/md'
import { MdOutlineDevices } from 'react-icons/md'
import { MdOutlineNotifications } from 'react-icons/md'
import { MdOutlineDelete } from 'react-icons/md'

export default function Sidebar({ onChange }) {
  const [options, setOptions] = useState([
    {
      name: translate('ACCOUNT_SETTINGS.BASIC_INFORMATION'),
      icon: <MdOutlinePersonOutline />,
      active: true,
    },
    {
      name: translate('ACCOUNT_SETTINGS.PREFERENCES'),
      icon: <MdOutlineSettings />,
      active: false,
    },
    {
      name: translate('ACCOUNT_SETTINGS.SECURITY'),
      icon: <MdLockOutline />,
      active: false,
    },
    {
      name: translate('ACCOUNT_SETTINGS.RECENT_DEVICES'),
      icon: <MdOutlineDevices />,
      active: false,
    },
    {
      name: translate('ACCOUNT_SETTINGS.NOTIFICATIONS'),
      icon: <MdOutlineNotifications />,
      active: false,
    },
    {
      name: translate('ACCOUNT_SETTINGS.DELETE_ACCOUNT'),
      icon: <MdOutlineDelete />,
      active: false,
    },
  ])

  const handleSelection = (option, index) => {
    options?.forEach((option, key) => (option.active = key === index))

    setOptions([...options])
    onChange?.(option.name)
  }

  return (
    <div className="account-settings-container__sidebar">
      {options.map((option, index) => (
        <div
          key={index}
          className={`account-settings-container__sidebar__item ${option.active && 'account-settings-container__sidebar__item--active'}`}
          onClick={() => handleSelection(option, index)}
        >
          {option.icon}
          <span className="account-settings-container__sidebar__item--name">
            {option.name}
          </span>
        </div>
      ))}
    </div>
  )
}
