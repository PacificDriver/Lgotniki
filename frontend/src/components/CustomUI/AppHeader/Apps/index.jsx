import React from 'react'

import { useRequire as getLocalFile } from '../../../../utils/utils'

import { Dropdown, DropdownContent } from '../../../BaseUI/Dropdown'

import { HiOutlineViewGridAdd } from 'react-icons/hi'

import styles from './Apps.module.scss'

const listApps = [
  { name: 'Bitbucket', image: getLocalFile('brands/bitbucket.jpg') },
  { name: 'Slack', image: getLocalFile('brands/slack.png') },
  { name: 'Figma', image: getLocalFile('brands/figma.png') },
  { name: 'Mailchimp', image: getLocalFile('brands/mailchimp.jpg') },
  { name: 'Dropbox', image: getLocalFile('brands/dropbox.png') },
  { name: 'Trello', image: getLocalFile('brands/trello.png') },
]

export default function Apps() {
  return (
    <div className={styles['apps-container']}>
      <Dropdown
        trigger={
          <HiOutlineViewGridAdd className={styles['apps-trigger-icon']} />
        }
        placement="right"
        hideDropdownIcon={true}
        triggerClassName={styles['custom-trigger']}
      >
        <DropdownContent className={styles['apps-container__custom-content']}>
          <div className={styles['list-items']}>
            {listApps.map(({ name, image }, index) => (
              <div key={index} className={styles['list-items__item']}>
                <img
                  src={image}
                  alt={name}
                  className={styles['list-items__item__image']}
                />
                <h5 className={styles['list-items__item__name']}>{name}</h5>
              </div>
            ))}
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  )
}
