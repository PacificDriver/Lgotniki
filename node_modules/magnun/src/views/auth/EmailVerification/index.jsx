import React from 'react'

import Button from '../../../components/BaseUI/Button'
import Content from '../Content'

import { MdEmail } from 'react-icons/md'

import styles from './EmailVerification.module.scss'
import { useTitle } from '../../../hooks/useTitle'
import { translate } from '../../../hooks/translate'

export default function EmailVerification() {
  useTitle('Email Verification | Magnun - React Admin Template')

  return (
    <div className={styles['email-verification-container']}>
      <Content title={translate('AUTHENTICATION.EMAIL_VERIFICATION')}>
        <div className="d-flex justify-content-center w-100">
          <div className={styles['icon']}>
            <MdEmail />
          </div>
        </div>

        <h4 className={styles['message']}>
          {translate('AUTHENTICATION.CHECK_YOUR_EMAIL')}
        </h4>
        <p className={styles['message']}>
          {translate('AUTHENTICATION.WE_SENT_A_CONFIRMATION_EMAIL')}{' '}
          <strong>youremail@domain.com</strong>.{' '}
          {translate('AUTHENTICATION.CLICK_ON_THE_LINK_TO_CONFIRM')}
        </p>

        <div className="mt-4">
          <Button
            title={translate('AUTHENTICATION.CHECK_EMAIL')}
            appearance="primary"
            isBlock={true}
          />
        </div>
      </Content>
    </div>
  )
}
