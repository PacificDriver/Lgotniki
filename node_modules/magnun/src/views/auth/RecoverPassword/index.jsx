import React from 'react'
import { useNavigate } from 'react-router-dom'

import Input from '../../../components/BaseUI/Input'
import Button from '../../../components/BaseUI/Button'
import Content from '../Content'

import styles from './RecoverPassword.module.scss'
import { useTitle } from '../../../hooks/useTitle'
import { translate } from '../../../hooks/translate'

export default function RecoverPassword() {
  const navigate = useNavigate()

  useTitle('Reset Password | Magnun - React Admin Template')

  return (
    <div className={styles['recover-password-container']}>
      <Content title={translate('AUTHENTICATION.REDEFINE_PASSWORD')}>
        <p className={styles['message']}>
          {translate('AUTHENTICATION.REDEFINE_PASSWORD_MESSAGE')}
        </p>

        <div className="mt-4">
          <Input
            type="email"
            label="Email"
            placeholder={translate('AUTHENTICATION.ENTER_YOUR_EMAIL')}
            className={styles['custom__input']}
            onFocused={true}
          />
        </div>

        <div className="mt-2">
          <Button
            title={translate('AUTHENTICATION.REDEFINE_PASSWORD')}
            appearance="primary"
            isBlock={true}
          />
        </div>

        <div className={styles['register']}>
          <span>{translate('AUTHENTICATION.REMEMBER_IF')}</span>
          <span
            className={styles['create__account']}
            onClick={() => navigate('/login')}
          >
            {translate('AUTHENTICATION.LOG_IN')}
          </span>
        </div>
      </Content>
    </div>
  )
}
