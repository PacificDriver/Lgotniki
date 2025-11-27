import React from 'react'
import { useNavigate } from 'react-router-dom'

import Input from '../../../components/BaseUI/Input'
import Button from '../../../components/BaseUI/Button'
import Content from '../Content'

import styles from './Register.module.scss'
import { useTitle } from '../../../hooks/useTitle'
import { translate } from '../../../hooks/translate'

export default function Register() {
  const navigate = useNavigate()

  useTitle('Register | Magnun - React Admin Template')

  return (
    <div className={styles['register-container']}>
      <Content title={translate('AUTHENTICATION.REGISTER_TO_CONTINUE')}>
        <div className="mt-4">
          <Input
            type="text"
            label={translate('UI.NAME')}
            placeholder={translate('AUTHENTICATION.ENTER_YOUR_NAME')}
            className={styles['custom__input']}
            onFocused={true}
          />

          <Input
            type="email"
            label="Email"
            placeholder={translate('AUTHENTICATION.ENTER_YOUR_EMAIL')}
            className={styles['custom__input']}
          />

          <Input
            type="password"
            label={translate('AUTHENTICATION.PASSWORD')}
            placeholder={translate('AUTHENTICATION.ENTER_YOUR_PASSWORD')}
            className={styles['custom__input']}
          />
        </div>

        <div className="mt-2">
          <Button
            title={translate('AUTHENTICATION.CREATE_AN_ACCOUNT')}
            appearance="primary"
            isBlock={true}
          />
        </div>

        <div className={styles['social__login']}>
          <div className={styles['divider']}>
            <span className={styles['line']}></span>
            <span>{translate('AUTHENTICATION.OR')}</span>
            <span className={styles['line']}></span>
          </div>

          <div className={styles['logins']}>
            <div className={styles['google']}>
              <img
                src={require('../../../assets/icons/google.png')}
                alt="Google"
              />
              <span>Google</span>
            </div>

            <div className={styles['microsoft']}>
              <img
                src={require('../../../assets/icons/microsoft.png')}
                alt="Microsoft"
              />
              <span>Microsoft</span>
            </div>
          </div>
        </div>

        <div className={styles['register']}>
          <span>{translate('AUTHENTICATION.I_ALREADY_HAVE_AN_ACCOUNT')}</span>
          <span
            className={styles['create__account']}
            onClick={() => navigate('/login')}
          >
            {translate('AUTHENTICATION.TO_ENTER')}
          </span>
        </div>
      </Content>
    </div>
  )
}
