import React, { useContext, useRef, useState } from 'react'
import { translate } from '../../../../../hooks/translate'
import { EmailContext } from '../../../../../contexts/email'

import Input from '../../../../../components/BaseUI/Input'
import IconButton from '../../../../../components/BaseUI/Button/IconButton'

import { MdOutlineDelete, MdClose } from 'react-icons/md'
import { FiMinus } from 'react-icons/fi'

import styles from './EmailComposeWeb.module.scss'
import SplitButton from '../../../../../components/BaseUI/Button/SplitButton'
import { DropdownItem } from '../../../../../components/BaseUI/Dropdown'

export default function EmailComposeWeb() {
  const [minimize, setMinimize] = useState(false)
  const { setCreateEmail } = useContext(EmailContext)
  const containerRef = useRef(null)

  const icons = [
    {
      icon: <FiMinus />,
      name: 'minimize-icon',
      fn: () => handleMinimize(!minimize),
    },
    { icon: <MdClose />, name: 'close-icon', fn: () => setCreateEmail(false) },
  ]

  const handleMinimize = status => {
    setMinimize(status)

    if (status) {
      containerRef.current.style.height = '48px'
      return
    }

    containerRef.current.style.height = '470px'
  }

  return (
    <div className={styles['email-compose-container']} ref={containerRef}>
      <div className={styles['email-compose-container__header']}>
        {translate('EMAIL.NEW_MESSAGE')}

        <div className="d-flex align-items-center gap-1">
          {icons?.map(({ icon, name, fn }, index) => (
            <IconButton
              key={index}
              label={name}
              icon={icon}
              shape="circle"
              appearance="subtle"
              className={styles['email-compose-container__header--icons']}
              onClick={fn}
            />
          ))}
        </div>
      </div>

      <div className={styles['email-compose-container__content']}>
        <div>
          <Input
            type="text"
            placeholder={translate('EMAIL.TO')}
            className={styles['email-compose-container__content--to']}
            useBorder={false}
          />

          <Input
            type="text"
            placeholder={translate('EMAIL.SUBJECT')}
            className={styles['email-compose-container__content--subject']}
            useBorder={false}
          />

          <textarea
            className={styles['email-compose-container__content--message']}
          ></textarea>
        </div>

        <div className="d-flex align-items-center justify-content-start gap-1">
          <SplitButton title={translate('UI.SEND')} appearance="primary">
            <DropdownItem>{translate('EMAIL.SCHEDULE_SHIPPING')}</DropdownItem>
          </SplitButton>

          <IconButton
            label="close-icon"
            icon={<MdOutlineDelete />}
            shape="circle"
            appearance="subtle"
            className={styles['email-compose-container--close-icon']}
            onClick={() => setCreateEmail(false)}
            tooltip={translate('EMAIL.TO_DISCARD')}
            tooltipPosition="top"
          />
        </div>
      </div>
    </div>
  )
}
