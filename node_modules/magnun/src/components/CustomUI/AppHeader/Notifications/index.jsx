import moment from 'moment'
import React from 'react'

import Badge from '../../../BaseUI/Badge'
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
} from '../../../BaseUI/Dropdown'
import Avatar from '../../Avatar'

import { FiBell } from 'react-icons/fi'

import styles from './Notifications.module.scss'

export default function Notifications({ values }) {
  const formatDate = value => {
    const date = moment(value)

    const now = moment()

    const difference = now.diff(date, 'days')

    if (difference === 0) return date.format('HH:mm')
    if (difference <= 365) return date.format('DD MMM')

    return date.format('DD/MM/YYYY')
  }

  return (
    <div className={styles['notifications-container']}>
      <Dropdown
        trigger={
          <div className={styles['icon']}>
            <Badge appearance="danger">
              <FiBell />
            </Badge>
          </div>
        }
        placement="right"
        hideDropdownIcon={true}
        triggerClassName={styles['notifications-container__notification']}
      >
        <DropdownContent
          className={styles['notifications-container__custom-content']}
        >
          <div className={styles['notifications-container__header']}>
            <span className={styles['title']}>Notificações</span>
            <span className={styles['link']}>Ver todas</span>
          </div>

          {values.map((notification, index) => (
            <DropdownItem key={index}>
              <div className={styles['notifications-container__content']}>
                <div
                  className={styles['notifications-container__content__info']}
                >
                  <div className="d-flex align-items-start">
                    <Avatar name={notification.user} />
                    <span className={styles['user']}>{notification.user}</span>
                  </div>
                  <span className={styles['date']}>
                    {formatDate(notification.date)}
                  </span>
                </div>

                <div className={styles['subject']}>{notification.subject}</div>
              </div>
            </DropdownItem>
          ))}
        </DropdownContent>
      </Dropdown>
    </div>
  )
}
