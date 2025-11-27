import React from 'react'
import Button from '../../Button'
import { Dropdown, DropdownContent } from '../../Dropdown'
import IconButton from '../IconButton'

import { MdKeyboardArrowDown } from 'react-icons/md'

import styles from './SplitButton.module.scss'

export default function SplitButton({
  appearance = 'default',
  children,
  disabled,
  title,
}) {
  return (
    <div className={styles['split-button-container']}>
      <Button
        title={title}
        appearance={appearance}
        disabled={disabled}
        className={styles['split-button-container__botton']}
        size="small"
        radius={0}
      />

      <div
        className={`${styles['split-button-container__divider']} ${appearance && styles[`split-button-container__divider--${appearance}`]}`}
      ></div>

      <Dropdown
        trigger={
          <IconButton
            icon={<MdKeyboardArrowDown />}
            appearance={appearance}
            className={styles['split-button-container__trigger-button']}
          />
        }
        hideDropdownIcon
        triggerClassName={`${styles['split-button-container__dropdown']}`}
      >
        <DropdownContent>{children}</DropdownContent>
      </Dropdown>
    </div>
  )
}
