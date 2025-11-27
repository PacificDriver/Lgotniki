import React from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '../../../components/BaseUI/Button'
import Input from '../../../components/BaseUI/Input'
import Avatar from '../../../components/CustomUI/Avatar'
import Content from '../Content'

import { translate } from '../../../hooks/translate'
import { useTitle } from '../../../hooks/useTitle'
import styles from './LockScreen.module.scss'

export default function LockScreen() {
  const navigate = useNavigate()

  useTitle('Lock Screen | Magnun - React Admin Template')

  return (
    <div className={styles['lock-screen-container']}>
      <Content title={translate('AUTHENTICATION.LOCK_SCREEN')}>
        <div className="d-flex flex-column align-items-center w-100 mt-3">
          <Avatar
            name="Beatriz Lopes"
            image={require('../../../assets/users/jennyfer.jpg')}
          />

          <span className="weight-500 size-15 mt-3">
            {translate('AUTHENTICATION.HI')}, Beatriz
          </span>
        </div>

        <p className={styles['message']}>
          {translate('AUTHENTICATION.ENTER_YOUR_PASSWORD_TO_LOG_IN_AGAIN')}
        </p>

        <div className="mt-4">
          <Input
            type="password"
            label={translate('AUTHENTICATION.PASSWORD')}
            placeholder={translate('AUTHENTICATION.ENTER_YOUR_PASSWORD')}
            className={styles['custom__input']}
            onFocused={true}
          />
        </div>

        <div className="mt-2">
          <Button
            title={translate('AUTHENTICATION.TO_ENTER')}
            appearance="primary"
            isBlock={true}
          />
        </div>

        <div className={styles['register']}>
          <span>{translate('AUTHENTICATION.NO_AND_YOU')}</span>
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
