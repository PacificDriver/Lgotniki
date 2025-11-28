import React, { useState } from 'react'
import { fileUploadAPI } from '../../../services/api'
import { useAuth } from '../../../services/useAuth'
import Button from '../../../components/BaseUI/Button'
import Select from '../../../components/BaseUI/Select'
import AppPage from '../../../components/CustomUI/AppPage'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'
import { Toast, ToastContainer } from '../../../components/CustomUI/Toast'
import Lozenge from '../../../components/BaseUI/Lozenge'
import {
  FiUpload,
  FiFile,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
} from 'react-icons/fi'
import styles from './FileUpload.module.scss'

const loadModeOptions = [
  { value: 'full_sync', label: 'Полная синхронизация' },
  { value: 'soft_add', label: 'Мягкое добавление' },
  { value: 'only_new', label: 'Только новые' },
  { value: 'only_update', label: 'Только обновление' },
  { value: 'full_reload', label: 'Полная перезагрузка' },
  { value: 'with_archive', label: 'С архивацией' },
  { value: 'with_manual_review', label: 'С ручной проверкой' },
  { value: 'with_delayed_deactivation', label: 'С отложенной деактивацией' },
  { value: 'by_load_counter', label: 'По счетчику загрузок' },
]

export default function FileUpload() {
  const { isAdmin, isOperator } = useAuth()
  const [file, setFile] = useState(null)
  const [loadMode, setLoadMode] = useState('full_sync')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [toasts, setToasts] = useState([])

  const breadcrumbs = [
    { label: 'Главная', url: '' },
    { label: 'Загрузка данных' },
  ]

  const handleFileChange = e => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
      ]
      if (
        validTypes.includes(selectedFile.type) ||
        selectedFile.name.endsWith('.xlsx') ||
        selectedFile.name.endsWith('.xls') ||
        selectedFile.name.endsWith('.csv')
      ) {
        setFile(selectedFile)
      } else {
        setToasts([
          {
            description:
              'Поддерживаются только файлы Excel (.xlsx, .xls) и CSV (.csv)',
            id: 'error-file',
            key: 'error-file',
            title: 'Неверный формат файла',
            appearance: 'danger',
          },
          ...toasts,
        ])
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setToasts([
        {
          description: 'Выберите файл для загрузки',
          id: 'error-no-file',
          key: 'error-no-file',
          title: 'Ошибка',
          appearance: 'danger',
        },
        ...toasts,
      ])
      return
    }

    try {
      setUploading(true)
      const uploadResult = await fileUploadAPI.upload(file, loadMode)
      setResult(uploadResult)
      setToasts([
        {
          description: `Обработано: ${uploadResult.created} создано, ${uploadResult.updated} обновлено. Ошибок: ${uploadResult.errors?.length || 0}`,
          id: 'success-upload',
          key: 'success-upload',
          title: 'Загрузка завершена',
          appearance: 'success',
        },
        ...toasts,
      ])
      setFile(null)
    } catch (error) {
      console.error('Upload error:', error)
      setToasts([
        {
          description:
            error.response?.data?.error || 'Ошибка при загрузке файла',
          id: 'error-upload',
          key: 'error-upload',
          title: 'Ошибка загрузки',
          appearance: 'danger',
        },
        ...toasts,
      ])
    } finally {
      setUploading(false)
    }
  }

  const removeToast = index => {
    const values = toasts
    values.splice(index, 1)
    setToasts([...values])
  }

  if (!isAdmin() && !isOperator()) {
    return (
      <AppPage title="Загрузка данных" breadcrumbs={breadcrumbs}>
        <Container>
          <ContainerItem sm={4} md={8} xl={12}>
            <div>У вас нет прав для загрузки данных</div>
          </ContainerItem>
        </Container>
      </AppPage>
    )
  }

  return (
    <>
      <AppPage title="Загрузка данных" breadcrumbs={breadcrumbs}>
        <Container>
          <ContainerItem sm={4} md={8} xl={12}>
            <div className={styles['upload-container']}>
              {/* Upload Card */}
              <div className={styles['upload-card']}>
                <div className={styles['upload-card__header']}>
                  <div className={styles['upload-card__header--icon']}>
                    <FiUpload />
                  </div>
                  <div className={styles['upload-card__header--content']}>
                    <h3>Загрузка реестра льготников</h3>
                    <p>Загрузите файл Excel или CSV для импорта данных</p>
                  </div>
                </div>

                <div className={styles['upload-card__body']}>
                  {/* Info Box */}
                  <div className={styles['info-box']}>
                    <FiInfo />
                    <div className={styles['info-box__content']}>
                      <p className={styles['info-box__content--title']}>
                        Поддерживаемые форматы
                      </p>
                      <p className={styles['info-box__content--text']}>
                        Excel (.xlsx, .xls) и CSV (.csv). Убедитесь, что файл
                        содержит корректные данные в правильном формате.
                      </p>
                    </div>
                  </div>

                  {/* File Upload Area */}
                  <div
                    className={`${styles['file-upload-area']} ${
                      file ? styles['file-upload-area--has-file'] : ''
                    } ${uploading ? styles['file-upload-area--uploading'] : ''}`}
                    style={{ position: 'relative' }}
                  >
                    {uploading && (
                      <div className={styles['loading-overlay']}>
                        <div className={styles['loading-overlay__spinner']} />
                        <div className={styles['loading-overlay__text']}>
                          Загрузка файла...
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChange}
                      disabled={uploading}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        opacity: 0,
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        zIndex: 1,
                      }}
                    />
                    <div className={styles['file-upload-area__icon']}>
                      {file ? <FiCheckCircle /> : <FiUpload />}
                    </div>
                    <div className={styles['file-upload-area__content']}>
                      {file ? (
                        <>
                          <p
                            className={
                              styles['file-upload-area__content--title']
                            }
                          >
                            Файл выбран
                          </p>
                          <div
                            className={
                              styles['file-upload-area__content--file-info']
                            }
                          >
                            <FiFile />
                            <span>{file.name}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <p
                            className={
                              styles['file-upload-area__content--title']
                            }
                          >
                            Нажмите для выбора файла или перетащите файл сюда
                          </p>
                          <p
                            className={
                              styles['file-upload-area__content--subtitle']
                            }
                          >
                            Поддерживаются форматы: .xlsx, .xls, .csv
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Mode Selector */}
                  <div className={styles['mode-selector']}>
                    <label className={styles['mode-selector__label']}>
                      Режим загрузки
                    </label>
                    <Select
                      value={loadMode}
                      onChange={e => setLoadMode(e.target.value)}
                      options={loadModeOptions}
                      selected={[loadMode]}
                      unique={true}
                      disabled={uploading}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className={styles['action-buttons']}>
                    <Button
                      appearance="primary"
                      onClick={handleUpload}
                      disabled={!file || uploading}
                      iconBefore={uploading ? null : <FiUpload />}
                    >
                      {uploading ? 'Загрузка...' : 'Загрузить файл'}
                    </Button>
                    {file && !uploading && (
                      <Button
                        appearance="subtle"
                        onClick={() => {
                          setFile(null)
                          setResult(null)
                        }}
                      >
                        Очистить
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Results Card */}
              {result && (
                <div className={styles['results-card']}>
                  <div className={styles['results-card__header']}>
                    <FiCheckCircle />
                    <h4>Результаты загрузки</h4>
                  </div>

                  <div className={styles['results-card__stats']}>
                    <div className={styles['results-card__stat-item']}>
                      <div className={styles['results-card__stat-item--label']}>
                        Всего строк
                      </div>
                      <div className={styles['results-card__stat-item--value']}>
                        {result.total || 0}
                      </div>
                    </div>
                    <div className={styles['results-card__stat-item']}>
                      <div className={styles['results-card__stat-item--label']}>
                        Создано
                      </div>
                      <div className={styles['results-card__stat-item--value']}>
                        <Lozenge appearance="success-subtle">
                          {result.created || 0}
                        </Lozenge>
                      </div>
                    </div>
                    <div className={styles['results-card__stat-item']}>
                      <div className={styles['results-card__stat-item--label']}>
                        Обновлено
                      </div>
                      <div className={styles['results-card__stat-item--value']}>
                        <Lozenge appearance="info-subtle">
                          {result.updated || 0}
                        </Lozenge>
                      </div>
                    </div>
                    {result.errors && result.errors.length > 0 && (
                      <div className={styles['results-card__stat-item']}>
                        <div
                          className={styles['results-card__stat-item--label']}
                        >
                          Ошибок
                        </div>
                        <div
                          className={styles['results-card__stat-item--value']}
                        >
                          <Lozenge appearance="danger-subtle">
                            {result.errors.length}
                          </Lozenge>
                        </div>
                      </div>
                    )}
                  </div>

                  {result.errors && result.errors.length > 0 && (
                    <div className={styles['results-card__errors']}>
                      <div className={styles['results-card__errors--header']}>
                        <FiAlertCircle />
                        <strong>Список ошибок</strong>
                      </div>
                      <div className={styles['results-card__errors--list']}>
                        <ul>
                          {result.errors.slice(0, 20).map((error, index) => (
                            <li key={index}>
                              Строка {error.row}: {error.error}
                            </li>
                          ))}
                          {result.errors.length > 20 && (
                            <li>
                              ... и еще {result.errors.length - 20} ошибок
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
