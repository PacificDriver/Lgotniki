import React from 'react'

import Button from '../../../components/BaseUI/Button'
import Content from '../Content'

import { MdMarkEmailRead } from 'react-icons/md'

import styles from './ConfirmEmail.module.scss'
import { useTitle } from '../../../hooks/useTitle'
import { translate } from '../../../hooks/translate'

export default function ConfirmEmail() {
  useTitle('Confirm Email | Magnun - React Admin Template')

  return (
    <div className={styles['confirm-email-container']}>
      <Content title={translate('AUTHENTICATION.EMAIL_CONFIRMATION')}>
        <div className="d-flex justify-content-center w-100">
          <div className={styles['icon']}>
            <MdMarkEmailRead />
          </div>
        </div>

        <h4 className={styles['message']}>
          {translate('AUTHENTICATION.EMAIL_CONFIRMED')}
        </h4>
        <p className={styles['message']}>
          {translate('AUTHENTICATION.EMAIL_CONFIRMED_MESSAGE')}
        </p>

        <div className="mt-4">
          <Button
            title={translate('AUTHENTICATION.LOG_IN')}
            appearance="primary"
            isBlock={true}
          />
        </div>
      </Content>
    </div>
  )
}
