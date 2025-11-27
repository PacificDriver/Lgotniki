import React, { useEffect, useState } from 'react'

import AppPage from '../../../components/CustomUI/AppPage'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'
import Input from '../../../components/BaseUI/Input'
import Button from '../../../components/BaseUI/Button'
import { Toast, ToastContainer } from '../../../components/CustomUI/Toast'
import Lozenge from '../../../components/BaseUI/Lozenge'

import { useAuth } from '../../../services/useAuth'
import { useLocalStorage } from '../../../hooks/useLocalStorage'
import { userAPI } from '../../../services/api'
import OperatorsManager from './OperatorsManager'

import './AccountSettings.scss'

export default function AccountSettings() {
  const { getUser, isAdmin } = useAuth()
  const { persistStorage } = useLocalStorage()
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await userAPI.getProfile()
        setProfile({
          fullName: data?.fullName || '',
          email: data?.email || '',
          password: '',
        })
      } catch (error) {
        console.error('Не удалось загрузить профиль', error)
        setToast({
          id: 'profile-load-error',
          key: 'profile-load-error',
          title: 'Ошибка загрузки профиля',
          appearance: 'danger',
          description:
            'Не получилось получить данные пользователя. Попробуйте обновить страницу.',
        })
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleSave = async event => {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = {
        fullName: profile.fullName,
        email: profile.email,
      }

      if (profile.password) {
        payload.password = profile.password
      }

      const updatedUser = await userAPI.updateProfile(payload)
      persistStorage('lgotniki_user', updatedUser)
      setProfile(prev => ({ ...prev, password: '' }))
      setToast({
        id: 'profile-updated',
        key: Date.now(),
        title: 'Профиль обновлен',
        appearance: 'success',
        description: 'Настройки пользователя успешно сохранены.',
      })
    } catch (error) {
      console.error('Ошибка сохранения профиля', error)
      setToast({
        id: 'profile-error',
        key: Date.now(),
        title: 'Ошибка сохранения',
        appearance: 'danger',
        description:
          error?.response?.data?.error ||
          'Не удалось сохранить изменения. Проверьте данные и попробуйте снова.',
      })
    } finally {
      setSaving(false)
    }
  }

  const user = getUser()

  return (
    <AppPage title="Настройки пользователя">
      <Container>
        <ContainerItem sm={4} md={8} xl={8}>
          <div className="card p-4 h-100">
            <h5 className="mb-3">Основная информация</h5>
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <Input
                  label="ФИО"
                  value={profile.fullName}
                  onChange={event =>
                    setProfile(prev => ({
                      ...prev,
                      fullName: event.target.value,
                    }))
                  }
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <Input
                  label="Email"
                  type="email"
                  value={profile.email}
                  onChange={event =>
                    setProfile(prev => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <Input
                  label="Новый пароль"
                  type="password"
                  placeholder="Оставьте пустым, если не хотите менять пароль"
                  value={profile.password}
                  onChange={event =>
                    setProfile(prev => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  disabled={loading}
                />
              </div>
              <Button
                appearance="primary"
                isBlock
                type="submit"
                disabled={saving || loading}
              >
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </form>
          </div>
        </ContainerItem>

        <ContainerItem sm={4} md={8} xl={4}>
          <div className="card p-4 h-100 d-flex flex-column gap-3">
            <h5>Статус учетной записи</h5>
            <div>
              <span className="d-block text-muted">Роль</span>
              <Lozenge
                appearance={
                  user?.role === 'admin'
                    ? 'warning-subtle'
                    : 'information-subtle'
                }
              >
                {user?.role === 'admin' ? 'Администратор' : 'Оператор'}
              </Lozenge>
            </div>
            <div>
              <span className="d-block text-muted">Логин</span>
              <strong>{user?.username}</strong>
            </div>
            <div>
              <span className="d-block text-muted">Статус</span>
              <Lozenge
                appearance={user?.isActive ? 'success-subtle' : 'danger-subtle'}
              >
                {user?.isActive ? 'Активен' : 'Заблокирован'}
              </Lozenge>
            </div>
            <p className="text-muted small mb-0">
              Если вы заметили подозрительную активность, смените пароль и
              обратитесь к администратору.
            </p>
          </div>
        </ContainerItem>

        {isAdmin() && (
          <ContainerItem sm={4} md={8} xl={12}>
            <OperatorsManager />
          </ContainerItem>
        )}
      </Container>

      {toast?.id && (
        <ToastContainer onDismissed={() => setToast(null)}>
          <Toast
            key={toast.key}
            id={toast.id}
            title={toast.title}
            description={toast.description}
            appearance={toast.appearance}
            isExpanded
          />
        </ToastContainer>
      )}
    </AppPage>
  )
}
