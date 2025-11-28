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
import { Table, Td, Tr } from '../../../components/BaseUI/Table'
import AppPage from '../../../components/CustomUI/AppPage'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'
import SidebarContainer from '../../../components/CustomUI/SidebarContainer'
import { Toast, ToastContainer } from '../../../components/CustomUI/Toast'
import Lozenge from '../../../components/BaseUI/Lozenge'
import { FiEdit3, FiTrash2 } from 'react-icons/fi'

export default function BenefitTypes() {
  const { isAdmin, isOperator } = useAuth()
  const [benefitTypes, setBenefitTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [sidebarOpened, setSidebarOpened] = useState(false)
  const [benefitTypeDetail, setBenefitTypeDetail] = useState(null)
  const [toasts, setToasts] = useState([])

  const headers = [
    { name: 'Название', dataType: 'text' },
    { name: 'Описание', dataType: 'text' },
    { name: 'Тип расчета', dataType: 'text' },
    { name: 'Параметры расчета', dataType: 'text' },
    { name: 'Маршруты', dataType: 'text' },
    { name: 'Населенные пункты', dataType: 'text' },
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
    confirm({
      title: `Удалить тип льготы "${benefitType?.name}"?`,
      message: 'Удаление необратимо. Все связанные данные будут затронуты.',
      appearance: 'danger',
      confirmButtonText: translate('UI.DELETE'),
      onConfirm: async () => {
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
              description: 'Ошибка при удалении типа льготы.',
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

  return (
    <>
      <AppPage
        title="Типы льгот"
        breadcrumbs={breadcrumbs}
        actions={
          (isAdmin() || isOperator()) && (
            <Button
              appearance="primary"
              onClick={() => {
                setSidebarOpened(true)
                setBenefitTypeDetail({})
              }}
            >
              Добавить тип льготы
            </Button>
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

            <Table
              title="Список типов льгот"
              columns={headers}
              tableId="benefit-types-list"
              loading={loading}
              checkboxSelection
              disableColumnMenu
              disableSearchFilter
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
                  <Tr key={benefitType.id} id={benefitType.id}>
                    <Td>{normalizeValue(benefitType.name)}</Td>
                    <Td>{normalizeValue(benefitType.description) || '-'}</Td>
                    <Td>
                      {normalizeValue(
                        getCalculationTypeLabel(benefitType.calculationType)
                      )}
                    </Td>
                    <Td>{getCalculationParamsText()}</Td>
                    <Td>
                      {benefitType.routes && benefitType.routes.length > 0
                        ? benefitType.routes.join(', ')
                        : 'Все маршруты'}
                    </Td>
                    <Td>
                      {benefitType.settlements &&
                      benefitType.settlements.length > 0
                        ? benefitType.settlements.join(', ')
                        : 'Все пункты'}
                    </Td>
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
                  </Tr>
                )
              })}
            </Table>
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
