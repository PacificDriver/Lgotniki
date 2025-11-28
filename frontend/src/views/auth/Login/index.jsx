import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { translate } from '../../../hooks/translate'
import { useAuth } from '../../../services/useAuth'

import Button from '../../../components/BaseUI/Button'
import Input from '../../../components/BaseUI/Input'
import Content from '../Content'

import { Toast, ToastContainer } from '../../../components/CustomUI/Toast'
import { useTitle } from '../../../hooks/useTitle'
import styles from './Login.module.scss'

import initialData from '../../../services/database/data'

export default function Login() {
  useTitle('Login | Magnun - React Admin Template')

  const navigate = useNavigate()
  const { login } = useAuth()

  const [user, setUser] = useState({
    email: 'admin',
    password: 'admin123',
  })
  const [toast, setToast] = useState()

  useEffect(() => {
    const worker = new Worker(
      new URL('../../../services/database/dbWorker.js', import.meta.url)
    )

    worker.postMessage(initialData)

    worker.onmessage = event => {
      if (event.data === 'Database initialized') {
        console.log('Initialization complete!')
      }
    }

    return () => {
      worker.terminate()
    }
  }, [])

  const sigin = () => {
    console.debug('[login] click', { user })
    const url = localStorage.getItem('redirectTo')
    const parsedUrl = url ? JSON.parse(url) : null

    login(user.email, user.password).then(response => {
      console.debug('[login] response', response)
      if (response) {
        navigate(parsedUrl ? parsedUrl : '/', { replace: true })
        localStorage.removeItem('redirectTo')
      } else {
        console.warn('[login] failed', {
          username: user.email,
          target: parsedUrl,
        })
        setToast({
          id: 1,
          key: 1,
          title: translate('AUTHENTICATION.INCORRECT_USERNAME_OR_PASSWORD'),
          appearance: 'danger',
        })
      }
    })
  }

  const removeToast = () => {
    setToast({})
  }

  return (
    <div className={styles['login-container']}>
      <Content title={translate('AUTHENTICATION.ENTER_TO_CONTINUE')}>
        <div className="mt-4">
          <Input
            type="text"
            label="Имя пользователя"
            placeholder="Введите имя пользователя"
            className={styles['custom__input']}
            value={user.email}
            onChange={event => setUser({ ...user, email: event.target.value })}
          />

          <Input
            type="password"
            label={translate('AUTHENTICATION.PASSWORD')}
            placeholder={translate('AUTHENTICATION.ENTER_YOUR_PASSWORD')}
            className={styles['custom__input']}
            value={user.password}
            onChange={event =>
              setUser({ ...user, password: event.target.value })
            }
          />
        </div>

        <div className={styles['forgot__password']}>
          <span>{translate('AUTHENTICATION.FORGOT_YOUR_PASSWORD')}</span>
        </div>

        <div className="mt-2">
          <Button
            title={translate('AUTHENTICATION.TO_ENTER')}
            appearance="primary"
            isBlock={true}
            onClick={() => sigin()}
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
          <span>{translate('AUTHENTICATION.DONT_HAVE_AN_ACCOUNT')}</span>
          <span
            className={styles['create__account']}
            onClick={() => navigate('/register')}
          >
            {translate('AUTHENTICATION.REGISTER')}
          </span>
        </div>
      </Content>

      {toast?.id && (
        <ToastContainer onDismissed={removeToast}>
          <Toast
            key={toast.key || toast.id}
            id={toast.id}
            title={toast.title}
            appearance={toast.appearance}
            description={toast.description}
            isExpanded={toast.isExpanded}
          />
        </ToastContainer>
      )}
    </div>
  )
}
