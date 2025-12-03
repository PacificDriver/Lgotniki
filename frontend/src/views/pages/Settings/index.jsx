import React, { useState, useEffect } from 'react'
import { stationsAPI } from '../../../services/api'
import { useAuth } from '../../../services/useAuth'
import Button from '../../../components/BaseUI/Button'
import AppPage from '../../../components/CustomUI/AppPage'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'
import { Toast, ToastContainer } from '../../../components/CustomUI/Toast'
import Lozenge from '../../../components/BaseUI/Lozenge'
import { FiRefreshCw, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import styles from './Settings.module.scss'

export default function Settings() {
  const { isAdmin } = useAuth()
  const [syncing, setSyncing] = useState(false)
  const [syncLogs, setSyncLogs] = useState([])
  const [toasts, setToasts] = useState([])
  const [loading, setLoading] = useState(false)

  const breadcrumbs = [{ label: 'Главная', url: '' }, { label: 'Настройки' }]

  useEffect(() => {
    loadSyncLogs()
  }, [])

  const loadSyncLogs = async () => {
    try {
      setLoading(true)
      const logs = await stationsAPI.getSyncLogs({ limit: 10 })
      setSyncLogs(logs)
    } catch (error) {
      console.error('Error loading sync logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    if (!isAdmin()) {
      setToasts([
        {
          id: 'error-permission',
          key: 'error-permission',
          title: 'Ошибка',
          description: 'Недостаточно прав для синхронизации',
          appearance: 'danger',
        },
        ...toasts,
      ])
      return
    }

    try {
      setSyncing(true)
      const result = await stationsAPI.sync()
      console.log('Sync result:', result)

      setToasts([
        {
          id: 'sync-completed',
          key: 'sync-completed',
          title: 'Синхронизация завершена',
          description:
            result.message ||
            `Обработано: ${result.processed || 0}, Создано: ${result.created || 0}, Обновлено: ${result.updated || 0}`,
          appearance: 'success',
        },
        ...toasts,
      ])

      // Обновляем журнал сразу после синхронизации
      await loadSyncLogs()
      setSyncing(false)
    } catch (error) {
      console.error('Sync error:', error)
      setSyncing(false)
      setToasts([
        {
          id: 'sync-error',
          key: 'sync-error',
          title: 'Ошибка синхронизации',
          description:
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Ошибка при синхронизации',
          appearance: 'danger',
        },
        ...toasts,
      ])

      // Все равно пытаемся обновить журнал, возможно там есть запись об ошибке
      await loadSyncLogs()
    }
  }

  const removeToast = index => {
    const values = toasts
    values.splice(index, 1)
    setToasts([...values])
  }

  const getStatusAppearance = status => {
    return status === 'success' ? 'success-subtle' : 'danger-subtle'
  }

  const getStatusIcon = status => {
    return status === 'success' ? (
      <FiCheckCircle style={{ color: 'var(--m-success)' }} />
    ) : (
      <FiAlertCircle style={{ color: 'var(--m-danger)' }} />
    )
  }

  return (
    <>
      <AppPage title="Настройки" breadcrumbs={breadcrumbs}>
        <Container>
          <ContainerItem sm={4} md={8} xl={12}>
            {/* Sync Section */}
            <div className={styles['settings-section']}>
              <div className={styles['settings-section__header']}>
                <div>
                  <h3>Синхронизация станций и маршрутов</h3>
                  <p>
                    Синхронизация справочника станций из внешнего API и
                    извлечение маршрутов из рейсов для работы с расчетом льгот
                  </p>
                </div>
                {isAdmin() && (
                  <Button
                    appearance="primary"
                    onClick={handleSync}
                    disabled={syncing}
                    iconBefore={
                      <FiRefreshCw
                        style={{
                          fontSize: '18px',
                          animation: syncing
                            ? 'spin 1s linear infinite'
                            : 'none',
                        }}
                      />
                    }
                  >
                    {syncing ? 'Синхронизация...' : 'Синхронизировать'}
                  </Button>
                )}
              </div>

              <div className={styles['settings-section__content']}>
                <h4>Журнал синхронизации</h4>
                {loading ? (
                  <p>Загрузка...</p>
                ) : syncLogs.length === 0 ? (
                  <p className={styles['empty-message']}>
                    Журнал синхронизации пуст. Запустите первую синхронизацию.
                  </p>
                ) : (
                  <div className={styles['sync-logs']}>
                    {syncLogs.map(log => (
                      <div key={log.id} className={styles['sync-log-item']}>
                        <div className={styles['sync-log-item__header']}>
                          <div className={styles['sync-log-item__status']}>
                            {getStatusIcon(log.status)}
                            <Lozenge
                              appearance={getStatusAppearance(log.status)}
                            >
                              {log.status === 'success' ? 'Успешно' : 'Ошибка'}
                            </Lozenge>
                          </div>
                          <div className={styles['sync-log-item__date']}>
                            {new Date(log.created_at).toLocaleString('ru-RU')}
                          </div>
                        </div>
                        <div className={styles['sync-log-item__stats']}>
                          <span>
                            Обработано: <strong>{log.records_processed}</strong>
                          </span>
                          <span>
                            Создано: <strong>{log.records_created}</strong>
                          </span>
                          <span>
                            Обновлено: <strong>{log.records_updated}</strong>
                          </span>
                        </div>
                        {log.error_message && (
                          <div className={styles['sync-log-item__error']}>
                            {log.error_message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ContainerItem>
        </Container>
      </AppPage>

      <ToastContainer>
        {toasts.map((toast, index) => (
          <Toast
            key={toast.key}
            title={toast.title}
            description={toast.description}
            appearance={toast.appearance}
            onRemove={() => removeToast(index)}
          />
        ))}
      </ToastContainer>
    </>
  )
}
