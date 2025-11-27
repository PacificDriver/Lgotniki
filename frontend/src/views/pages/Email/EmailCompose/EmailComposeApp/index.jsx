import React, { useContext } from 'react'
import { translate } from '../../../../../hooks/translate'
import { EmailContext } from '../../../../../contexts/email'

import Input from '../../../../../components/BaseUI/Input'
import IconButton from '../../../../../components/BaseUI/Button/IconButton'

import {
  MdOutlineDelete,
  MdChevronLeft,
  MdOutlineAttachment,
  MdSend,
} from 'react-icons/md'

import styles from './EmailComposeApp.module.scss'

export default function EmailComposeApp() {
  const { setCreateEmail } = useContext(EmailContext)

  const composeActions = [
    { icon: <MdOutlineAttachment /> },
    { icon: <MdOutlineDelete />, fn: () => setCreateEmail(false) },
    { icon: <MdSend /> },
  ]

  return (
    <div className={styles['email-compose-container-app']}>
      <div className={styles['email-compose-container-app__wrapper']}>
        <div className={styles['header']}>
          <IconButton
            icon={<MdChevronLeft />}
            shape="circle"
            appearance="subtle"
            onClick={() => setCreateEmail(false)}
            className={styles['header__icon']}
          />

          <div className={styles['header__actions']}>
            <span className={styles['header__actions__title']}>Compose</span>

            <div className={styles['header__actions__icons']}>
              {composeActions?.map(({ icon, fn }, index) => (
                <IconButton
                  key={index}
                  icon={icon}
                  shape="circle"
                  appearance="subtle"
                  onClick={() => fn?.()}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles['content']}>
          <div>
            <Input
              type="text"
              placeholder={translate('FRAGMENTS.FROM')}
              className={styles['content__from']}
              useBorder={false}
            />

            <Input
              type="text"
              placeholder={translate('EMAIL.TO')}
              className={styles['content__to']}
              useBorder={false}
            />

            <Input
              type="text"
              placeholder={translate('EMAIL.SUBJECT')}
              className={styles['content__subject']}
              useBorder={false}
            />

            <textarea className={styles['content__message']}></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}
