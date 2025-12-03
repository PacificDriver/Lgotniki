import React, { useState, useEffect } from 'react'
import { benefitTypesAPI } from '../../../services/api'
import { useAuth } from '../../../services/useAuth'
import { translate } from '../../../hooks/translate'
import { useModalConfirm as confirm } from '../../../hooks/useModalConfirm'
import useDebounce from '../../../hooks/useDebounce'
import Button from '../../../components/BaseUI/Button'
import IconButton from '../../../components/BaseUI/Button/IconButton'
import Input from '../../../components/BaseUI/Input'
import Select from '../../../components/BaseUI/Select'
import { Table, Td, ExpandableRow } from '../../../components/BaseUI/Table'
import AppPage from '../../../components/CustomUI/AppPage'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'
import SidebarContainer from '../../../components/CustomUI/SidebarContainer'
import { Toast, ToastContainer } from '../../../components/CustomUI/Toast'
import Lozenge from '../../../components/BaseUI/Lozenge'
import { FiEdit3, FiTrash2, FiDownload } from 'react-icons/fi'

export default function BenefitTypes() {
  const { isAdmin, isOperator } = useAuth()
  const [benefitTypes, setBenefitTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [sidebarOpened, setSidebarOpened] = useState(false)
  const [benefitTypeDetail, setBenefitTypeDetail] = useState(null)
  const [toasts, setToasts] = useState([])
  const [isExporting, setIsExporting] = useState(false)

  const headers = [
    { name: 'Название', dataType: 'text' },
    { name: 'Описание', dataType: 'text' },
    { name: 'Тип расчета', dataType: 'text' },
    { name: 'Параметры расчета', dataType: 'text' },
    { name: 'Статус', dataType: 'text' },
    { name: 'Действия' },
  ]

  const breadcrumbs = [{ label: 'Главная', url: '' }, { label: 'Типы льгот' }]

  useEffect(() => {
    loadBenefitTypes()
  }, [debouncedSearch])

  const loadBenefitTypes = async () => {
    try {
      setLoading(true)
      const params = {}
      if (debouncedSearch) params.search = debouncedSearch
      const data = await benefitTypesAPI.list(false, params)
      setBenefitTypes(data)
    } catch (error) {
      console.error('Error loading benefit types:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    const benefitType = benefitTypes.find(bt => bt.id === id)

    // Check for related data before showing modal
    let hasRelatedData = false
    let relatedDataMessage =
      'Удаление необратимо. Все связанные данные будут затронуты.'

    try {
      const relatedData = await benefitTypesAPI.checkRelatedData(id)
      if (relatedData.hasData) {
        hasRelatedData = true
        relatedDataMessage = `Невозможно удалить тип льготы. Есть связанные данные: ${relatedData.details.join(', ')}.`
      }
    } catch (error) {
      console.error('Error checking related data:', error)
    }

    confirm({
      title: `Удалить тип льготы "${benefitType?.name}"?`,
      message: relatedDataMessage,
      appearance: 'danger',
      confirmButtonText: translate('UI.DELETE'),
      confirmButtonDisabled: hasRelatedData,
      onConfirm: async () => {
        if (hasRelatedData) return

        try {
          await benefitTypesAPI.delete(id)
          loadBenefitTypes()
          setToasts([
            {
              description: `Тип льготы "${benefitType?.name}" успешно удален.`,
              id: id,
              key: id,
              title: 'Тип льготы удален',
              appearance: 'success',
            },
            ...toasts,
          ])
        } catch (error) {
          console.error('Error deleting benefit type:', error)
          setToasts([
            {
              description:
                error.response?.data?.error ||
                'Ошибка при удалении типа льготы.',
              id: `error-${id}`,
              key: `error-${id}`,
              title: 'Ошибка',
              appearance: 'danger',
            },
            ...toasts,
          ])
        }
      },
    })
  }

  const removeToast = index => {
    const values = toasts
    values.splice(index, 1)
    setToasts([...values])
  }

  // Получаем выбранные строки из таблицы через DOM
  // Редактирование по двойному клику
  const handleDoubleClickEdit = (id, e) => {
    // Предотвращаем раскрытие строки при двойном клике
    e?.stopPropagation()

    if (!isAdmin() && !isOperator()) return

    const benefitType = benefitTypes.find(bt => bt.id === id)
    if (benefitType) {
      setSidebarOpened(true)
      setBenefitTypeDetail(benefitType)
    }
  }

  const closeSidebar = () => {
    setSidebarOpened(false)
    setBenefitTypeDetail(null)
  }

  const getCalculationTypeLabel = type => {
    const labels = {
      fixed_trips: 'Фиксированное количество поездок',
      kilometer_limit: 'Лимит километров',
      discount_percent: 'Процент скидки',
      free: 'Бесплатный проезд',
    }
    return labels[type] || type
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const params = {}
      if (debouncedSearch) params.search = debouncedSearch
      const rows = await benefitTypesAPI.list(false, params)

      if (!rows || rows.length === 0) {
        setToasts([
          {
            id: 'export-empty',
            key: 'export-empty',
            title: 'Нет данных для экспорта',
            appearance: 'warning',
            description: 'По текущим фильтрам не найдено записей для выгрузки.',
          },
          ...toasts,
        ])
        return
      }

      const csvHeader = [
        'Название',
        'Описание',
        'Тип расчета',
        'Параметры расчета',
        'Маршруты',
        'Статус',
      ]

      const getCalculationParamsText = item => {
        if (!item.calculationParams) return ''
        const params = item.calculationParams
        if (params.trips) return `${params.trips} поездок`
        if (params.kilometers) return `${params.kilometers} км`
        if (params.discountPercent) return `${params.discountPercent}%`
        return ''
      }

      const csvRows = rows.map(item => [
        item.name || '',
        item.description || '',
        getCalculationTypeLabel(item.calculationType),
        getCalculationParamsText(item),
        item.routes && item.routes.length > 0 ? item.routes.join(', ') : '',
        item.isActive ? 'Активен' : 'Неактивен',
      ])

      const wrap = value => {
        const sanitized = `${value ?? ''}`.replace(/"/g, '""')
        return `"${sanitized}"`
      }

      const csvContent = [csvHeader, ...csvRows]
        .map(row => row.map(wrap).join(';'))
        .join('\n')

      const blob = new Blob([`\uFEFF${csvContent}`], {
        type: 'text/csv;charset=utf-8;',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `benefit-types_${new Date().toISOString().slice(0, 10)}.csv`
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setToasts([
        {
          id: 'export-success',
          key: 'export-success',
          title: 'Экспорт выполнен',
          appearance: 'success',
          description: `Успешно экспортировано записей: ${rows.length}.`,
        },
        ...toasts,
      ])
    } catch (error) {
      console.error('Export benefit types error:', error)
      setToasts([
        {
          id: 'export-error',
          key: 'export-error',
          title: 'Ошибка экспорта',
          appearance: 'danger',
          description:
            error.response?.data?.error || 'Ошибка при экспорте данных',
        },
        ...toasts,
      ])
    } finally {
      setIsExporting(false)
    }
  }

  const renderBenefitTypeDetails = benefitType => {
    const formatDate = date => {
      if (!date) return '-'
      try {
        return new Date(date).toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      } catch (e) {
        return date
      }
    }

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
        }}
      >
        {benefitType.description && (
          <div>
            <strong>Описание:</strong>
            <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
              {benefitType.description}
            </p>
          </div>
        )}

        <div>
          <strong>Тип расчета:</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
            {getCalculationTypeLabel(benefitType.calculationType)}
          </p>
        </div>

        {benefitType.calculationParams && (
          <div>
            <strong>Параметры расчета:</strong>
            <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
              {benefitType.calculationParams.trips &&
                `${benefitType.calculationParams.trips} поездок`}
              {benefitType.calculationParams.kilometers &&
                `${benefitType.calculationParams.kilometers} км`}
              {benefitType.calculationParams.discountPercent &&
                `${benefitType.calculationParams.discountPercent}%`}
              {!benefitType.calculationParams.trips &&
                !benefitType.calculationParams.kilometers &&
                !benefitType.calculationParams.discountPercent &&
                '-'}
            </p>
          </div>
        )}

        <div>
          <strong>Населенные пункты:</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
            {benefitType.settlements && benefitType.settlements.length > 0
              ? benefitType.settlements.join(', ')
              : 'Все пункты'}
          </p>
        </div>

        <div>
          <strong>Статус:</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
            {benefitType.isActive ? 'Активен' : 'Неактивен'}
          </p>
        </div>

        {benefitType.createdAt && (
          <div>
            <strong>Создан:</strong>
            <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
              {formatDate(benefitType.createdAt)}
            </p>
          </div>
        )}

        {benefitType.updatedAt && (
          <div>
            <strong>Обновлен:</strong>
            <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
              {formatDate(benefitType.updatedAt)}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <AppPage
        title="Типы льгот"
        breadcrumbs={breadcrumbs}
        actions={
          (isAdmin() || isOperator()) && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button
                appearance="primary"
                onClick={() => {
                  setSidebarOpened(true)
                  setBenefitTypeDetail({})
                }}
              >
                Добавить тип льготы
              </Button>
              <Button
                appearance="default"
                iconBefore={<FiDownload />}
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? 'Экспорт...' : 'Экспорт CSV'}
              </Button>
            </div>
          )
        }
      >
        <Container>
          <ContainerItem sm={4} md={8} xl={12}>
            <div className="d-flex gap-2 mb-3">
              <Input
                placeholder="Поиск по названию, описанию..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>

            <div>
              <Table
                title="Список типов льгот"
                columns={headers}
                tableId="benefit-types-list"
                loading={loading}
                disableColumnMenu
                disableSearchFilter
                disableExport
              >
                {benefitTypes.map(benefitType => {
                  // Normalize all values to prevent null/undefined errors in table search
                  const normalizeValue = value => {
                    if (value === null || value === undefined) return ''
                    return String(value)
                  }

                  const getCalculationParamsText = () => {
                    if (!benefitType.calculationParams) return '-'
                    const params = benefitType.calculationParams
                    if (params.trips) return `${params.trips} поездок`
                    if (params.kilometers) return `${params.kilometers} км`
                    if (params.discountPercent)
                      return `${params.discountPercent}%`
                    return '-'
                  }

                  return (
                    <ExpandableRow
                      key={benefitType.id}
                      id={benefitType.id}
                      expandableContent={renderBenefitTypeDetails(benefitType)}
                      onDoubleClick={
                        isAdmin() || isOperator()
                          ? handleDoubleClickEdit
                          : undefined
                      }
                    >
                      <Td
                        onDoubleClick={
                          isAdmin() || isOperator()
                            ? () => {
                                setSidebarOpened(true)
                                setBenefitTypeDetail(benefitType)
                              }
                            : undefined
                        }
                        style={{
                          cursor:
                            isAdmin() || isOperator() ? 'pointer' : 'default',
                        }}
                      >
                        {normalizeValue(benefitType.name)}
                      </Td>
                      <Td>{normalizeValue(benefitType.description) || '-'}</Td>
                      <Td>
                        {normalizeValue(
                          getCalculationTypeLabel(benefitType.calculationType)
                        )}
                      </Td>
                      <Td>{getCalculationParamsText()}</Td>
                      <Td>
                        <Lozenge
                          appearance={
                            benefitType.isActive
                              ? 'success-subtle'
                              : 'neutral-subtle'
                          }
                        >
                          {normalizeValue(
                            benefitType.isActive ? 'Активен' : 'Неактивен'
                          )}
                        </Lozenge>
                      </Td>
                      <Td>
                        <div className="d-flex align-items-center">
                          {(isAdmin() || isOperator()) && (
                            <IconButton
                              icon={<FiEdit3 style={{ fontSize: '18px' }} />}
                              appearance="subtle"
                              shape="circle"
                              onClick={() => {
                                setSidebarOpened(true)
                                setBenefitTypeDetail(benefitType)
                              }}
                            />
                          )}
                          {isAdmin() && (
                            <IconButton
                              icon={<FiTrash2 style={{ fontSize: '18px' }} />}
                              appearance="subtle"
                              shape="circle"
                              onClick={() => handleDelete(benefitType.id)}
                            />
                          )}
                        </div>
                      </Td>
                    </ExpandableRow>
                  )
                })}
              </Table>
            </div>
          </ContainerItem>
        </Container>
      </AppPage>

      <SidebarContainer
        title={
          benefitTypeDetail?.id
            ? 'Редактировать тип льготы'
            : 'Добавить тип льготы'
        }
        show={sidebarOpened}
        onClose={closeSidebar}
      >
        <BenefitTypeForm
          benefitType={benefitTypeDetail}
          onSave={async data => {
            try {
              if (benefitTypeDetail?.id) {
                await benefitTypesAPI.update(benefitTypeDetail.id, data)
                setToasts(prev => [
                  {
                    id: `update-success-${Date.now()}`,
                    key: `update-success-${Date.now()}`,
                    title: 'Успешно',
                    appearance: 'success',
                    description: 'Тип льготы успешно обновлен.',
                  },
                  ...prev,
                ])
              } else {
                await benefitTypesAPI.create(data)
                setToasts(prev => [
                  {
                    id: `create-success-${Date.now()}`,
                    key: `create-success-${Date.now()}`,
                    title: 'Успешно',
                    appearance: 'success',
                    description: 'Тип льготы успешно создан.',
                  },
                  ...prev,
                ])
              }
              setSidebarOpened(false)
              setBenefitTypeDetail(null)
              loadBenefitTypes()
            } catch (error) {
              console.error('Error saving benefit type:', error)
              setToasts(prev => [
                {
                  id: `save-error-${Date.now()}`,
                  key: `save-error-${Date.now()}`,
                  title: 'Ошибка',
                  appearance: 'danger',
                  description:
                    error.response?.data?.error ||
                    'Ошибка при сохранении типа льготы.',
                },
                ...prev,
              ])
            }
          }}
        />
      </SidebarContainer>

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

function BenefitTypeForm({ benefitType, onSave }) {
  const [formData, setFormData] = useState({
    name: benefitType?.name || '',
    description: benefitType?.description || '',
    calculationType: benefitType?.calculationType || 'discount_percent',
    calculationParams: benefitType?.calculationParams || {},
    routes: benefitType?.routes || [],
    settlements: benefitType?.settlements || [],
    isActive: benefitType?.isActive !== undefined ? benefitType.isActive : true,
  })

  // Update form data when benefitType changes
  useEffect(() => {
    setFormData({
      name: benefitType?.name || '',
      description: benefitType?.description || '',
      calculationType: benefitType?.calculationType || 'discount_percent',
      calculationParams: benefitType?.calculationParams || {},
      routes: benefitType?.routes || [],
      settlements: benefitType?.settlements || [],
      isActive:
        benefitType?.isActive !== undefined ? benefitType.isActive : true,
    })
  }, [benefitType])

  const calculationTypeOptions = [
    { value: 'fixed_trips', label: 'Фиксированное количество поездок' },
    { value: 'kilometer_limit', label: 'Лимит километров' },
    { value: 'discount_percent', label: 'Процент скидки' },
    { value: 'free', label: 'Бесплатный проезд' },
  ]

  const handleSubmit = e => {
    e.preventDefault()
    // Prepare data for saving - ensure calculationParams is properly formatted
    const dataToSave = {
      ...formData,
      calculationParams: formData.calculationParams || {},
    }

    // Clean up calculationParams - remove undefined/null values
    if (dataToSave.calculationParams) {
      Object.keys(dataToSave.calculationParams).forEach(key => {
        if (
          dataToSave.calculationParams[key] === undefined ||
          dataToSave.calculationParams[key] === null ||
          dataToSave.calculationParams[key] === ''
        ) {
          delete dataToSave.calculationParams[key]
        }
      })
    }

    onSave(dataToSave)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <Input
          label="Название"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <Input
          label="Описание"
          value={formData.description}
          onChange={e =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>
      <div className="mb-3">
        <Select
          label="Тип расчета"
          value={formData.calculationType}
          onChange={e =>
            setFormData({ ...formData, calculationType: e.target.value })
          }
          options={calculationTypeOptions}
          selected={[formData.calculationType]}
          unique={true}
          required
        />
      </div>
      {formData.calculationType === 'fixed_trips' && (
        <div className="mb-3">
          <Input
            label="Количество поездок"
            type="number"
            value={formData.calculationParams?.trips || ''}
            onChange={e => {
              const value = e.target.value
              setFormData({
                ...formData,
                calculationParams: {
                  ...formData.calculationParams,
                  trips: value ? parseInt(value) || 0 : undefined,
                },
              })
            }}
          />
        </div>
      )}
      {formData.calculationType === 'kilometer_limit' && (
        <div className="mb-3">
          <Input
            label="Лимит километров"
            type="number"
            value={formData.calculationParams?.kilometers || ''}
            onChange={e => {
              const value = e.target.value
              setFormData({
                ...formData,
                calculationParams: {
                  ...formData.calculationParams,
                  kilometers: value ? parseFloat(value) || 0 : undefined,
                },
              })
            }}
          />
        </div>
      )}
      {formData.calculationType === 'discount_percent' && (
        <div className="mb-3">
          <Input
            label="Процент скидки"
            type="number"
            min="0"
            max="100"
            value={formData.calculationParams?.discountPercent || ''}
            onChange={e => {
              const value = e.target.value
              setFormData({
                ...formData,
                calculationParams: {
                  ...formData.calculationParams,
                  discountPercent: value ? parseInt(value) || 0 : undefined,
                },
              })
            }}
          />
        </div>
      )}
      <div className="mt-4">
        <Button appearance="primary" type="submit">
          {translate('UI.SAVE')}
        </Button>
      </div>
    </form>
  )
}
