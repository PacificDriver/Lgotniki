import React, { useContext } from 'react'

import { EmailContext } from '../../../../contexts/email'

import Button from '../../../../components/BaseUI/Button'

import { MdOutlineEdit } from 'react-icons/md'

import styles from './EmailSidebar.module.scss'

const EmailSidebar = () => {
  const {
    currentSidebar,
    setCurrentSidebar,
    actions,
    showEmailDetails,
    showEmailList,
    setCreateEmail,
  } = useContext(EmailContext)

  const handleSidebarChange = value => {
    setCurrentSidebar(value)
    showEmailList()
  }

  return (
    <div className={styles['sidebar-container']}>
      <div className={styles['sidebar-container__compose-button']}>
        <Button
          appearance="primary"
          radius={20}
          isBlock
          iconBefore={<MdOutlineEdit />}
          onClick={() => setCreateEmail(true)}
        >
          Compose
        </Button>
      </div>

      <ul
        className={`${styles['action-list']} ${showEmailDetails && styles['action-list--read']}`}
      >
        {actions.map(({ name, icon, quantity, type }, index) => (
          <li
            key={index}
            className={`${styles['action-list__action-item']} ${type === currentSidebar && styles['action-list__action-item--active-action']}`}
            onClick={() => handleSidebarChange(type)}
          >
            <div className={styles['action-list__action-item__info']}>
              <span className={styles['action-list__action-item__info--icon']}>
                {icon}
              </span>
              <span className={styles['action-list__action-item__info--name']}>
                {name}
              </span>
            </div>

            {quantity > 0 && (
              <div className={styles['action-list__action-item__counter']}>
                {quantity}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EmailSidebar
