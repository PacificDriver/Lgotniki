import React, { useState } from 'react'
import { fileUploadAPI } from '../../../services/api'
import { useAuth } from '../../../services/useAuth'
import Button from '../../../components/BaseUI/Button'
import Input from '../../../components/BaseUI/Input'
import Select from '../../../components/BaseUI/Select'
import AppPage from '../../../components/CustomUI/AppPage'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'
import { Toast, ToastContainer } from '../../../components/CustomUI/Toast'
import Lozenge from '../../../components/BaseUI/Lozenge'

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
            <div className="mb-4">
              <h3>Загрузка реестра льготников</h3>
              <p className="text-muted">
                Поддерживаются форматы: Excel (.xlsx, .xls) и CSV (.csv)
              </p>
            </div>

            <div className="mb-3">
              <Input
                label="Выберите файл"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
              />
              {file && (
                <div className="mt-2">
                  <Lozenge appearance="info-subtle">
                    Выбран: {file.name}
                  </Lozenge>
                </div>
              )}
            </div>

            <div className="mb-3">
              <Select
                label="Режим загрузки"
                value={loadMode}
                onChange={e => setLoadMode(e.target.value)}
                options={loadModeOptions}
                selected={[loadMode]}
                unique={true}
              />
            </div>

            <div className="mb-3">
              <Button
                appearance="primary"
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? 'Загрузка...' : 'Загрузить'}
              </Button>
            </div>

            {result && (
              <div className="mt-4 p-3 border rounded">
                <h4>Результаты загрузки</h4>
                <div className="d-flex gap-3">
                  <div>
                    <strong>Всего строк:</strong> {result.total}
                  </div>
                  <div>
                    <strong>Создано:</strong>{' '}
                    <Lozenge appearance="success-subtle">
                      {result.created}
                    </Lozenge>
                  </div>
                  <div>
                    <strong>Обновлено:</strong>{' '}
                    <Lozenge appearance="info-subtle">{result.updated}</Lozenge>
                  </div>
                  {result.errors && result.errors.length > 0 && (
                    <div>
                      <strong>Ошибок:</strong>{' '}
                      <Lozenge appearance="danger-subtle">
                        {result.errors.length}
                      </Lozenge>
                    </div>
                  )}
                </div>
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-3">
                    <strong>Ошибки:</strong>
                    <ul>
                      {result.errors.slice(0, 10).map((error, index) => (
                        <li key={index}>
                          Строка {error.row}: {error.error}
                        </li>
                      ))}
                      {result.errors.length > 10 && (
                        <li>... и еще {result.errors.length - 10} ошибок</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
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
