import React, { useState, useEffect } from 'react'
import { beneficiariesAPI, benefitTypesAPI } from '../../../services/api'
import { useAuth } from '../../../services/useAuth'
import { translate } from '../../../hooks/translate'
import { useModalConfirm as confirm } from '../../../hooks/useModalConfirm'
import useDebounce from '../../../hooks/useDebounce'
import Button from '../../../components/BaseUI/Button'
import IconButton from '../../../components/BaseUI/Button/IconButton'
import Input from '../../../components/BaseUI/Input'
import Select from '../../../components/BaseUI/Select'
import DatePicker from '../../../components/CustomUI/DatePicker'
import { Table, Td, Tr } from '../../../components/BaseUI/Table'
import AppPage from '../../../components/CustomUI/AppPage'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'
import SidebarContainer from '../../../components/CustomUI/SidebarContainer'
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '../../../components/BaseUI/Modal'
import { Toast, ToastContainer } from '../../../components/CustomUI/Toast'
import Lozenge from '../../../components/BaseUI/Lozenge'
import {
  FiEdit3,
  FiEye,
  FiTrash2,
  FiUserPlus,
  FiDownload,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiPlus,
  FiGift,
  FiCreditCard,
  FiRefreshCw,
  FiInfo,
} from 'react-icons/fi'
import BulkAddModal from './BulkAddModal'

const statusOptions = [
  { value: 'active', label: 'Активен' },
  { value: 'inactive', label: 'Неактивен' },
  { value: 'archive', label: 'Архив' },
  { value: 'under_review', label: 'На проверке' },
  { value: 'possibly_lost', label: 'Возможно утратил льготу' },
]

export default function Beneficiaries() {
  const { isAdmin, isOperator } = useAuth()
  const [beneficiaries, setBeneficiaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300) // Debounce search input
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })
  const [openModal, setOpenModal] = useState(false)
  const [beneficiaryDetail, setBeneficiaryDetail] = useState(null)
  const [sidebarOpened, setSidebarOpened] = useState(false)
  const [bulkAddModalOpen, setBulkAddModalOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [toasts, setToasts] = useState([])
  const [operations, setOperations] = useState([])
  const [loadingOperations, setLoadingOperations] = useState(false)
  const [benefitTypesMap, setBenefitTypesMap] = useState({})

  const headers = [
    { name: 'ФИО', dataType: 'text' },
    { name: 'Телефон', dataType: 'text' },
    { name: 'Email', dataType: 'text' },
    { name: 'СНИЛС', dataType: 'text' },
    { name: 'Дата рождения', dataType: 'date' },
    { name: 'Тип льготы', dataType: 'text' },
    { name: 'Место проживания', dataType: 'text' },
    { name: 'RFID', dataType: 'text' },
    { name: 'NFC ID', dataType: 'text' },
    { name: 'Hash PAN', dataType: 'text' },
    { name: 'Статус', dataType: 'text' },
    { name: translate('UI.ACTIONS') },
  ]

  const breadcrumbs = [
    { label: 'Главная', url: '' },
    { label: 'Реестр льготников' },
  ]

  const loadBeneficiaries = async () => {
    try {
      setLoading(true)
      const params = {
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
      }
      if (debouncedSearch) params.search = debouncedSearch
      if (statusFilter && statusFilter !== '' && statusFilter !== 'undefined') {
        params.status = statusFilter
      }
      const result = await beneficiariesAPI.list(params)
      setBeneficiaries(result.beneficiaries || [])
      setPagination(prev => ({ ...prev, total: result.total || 0 }))
    } catch (error) {
      console.error('Error loading beneficiaries:', error)
    } finally {
      setLoading(false)
    }
  }

  // Reset to first page when search or filter changes
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [debouncedSearch, statusFilter])

  useEffect(() => {
    loadBeneficiaries()
  }, [pagination.page, debouncedSearch, statusFilter])

  // Загружаем типы льгот для отображения в истории
  useEffect(() => {
    const loadBenefitTypes = async () => {
      try {
        const types = await benefitTypesAPI.list(false)
        if (Array.isArray(types)) {
          const map = {}
          types.forEach(type => {
            map[type.id] = type.name
          })
          setBenefitTypesMap(map)
        }
      } catch (error) {
        console.error('Error loading benefit types:', error)
      }
    }
    loadBenefitTypes()
  }, [])

  const handleDelete = async id => {
    const beneficiary = beneficiaries.find(b => b.id === id)
    confirm({
      title: `Удалить льготника ${beneficiary?.fullName}?`,
      message: 'Удаление необратимо. Все данные будут удалены.',
      appearance: 'danger',
      confirmButtonText: translate('UI.DELETE'),
      onConfirm: async () => {
        try {
          await beneficiariesAPI.delete(id)
          loadBeneficiaries()
          setToasts([
            {
              description: `Льготник "${beneficiary?.fullName}" успешно удален из системы.`,
              id: id,
              key: id,
              title: 'Льготник успешно удален!',
              appearance: 'success',
            },
            ...toasts,
          ])
        } catch (error) {
          console.error('Error deleting beneficiary:', error)
          setToasts([
            {
              description: 'Ошибка при удалении льготника.',
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

  // Редактирование по двойному клику
  const handleDoubleClickEdit = (id, e) => {
    // Предотвращаем другие действия при двойном клике
    e?.stopPropagation()

    if (!isAdmin() && !isOperator()) return

    const beneficiary = beneficiaries.find(b => b.id === id)
    if (beneficiary) {
      setSidebarOpened(true)
      setBeneficiaryDetail(beneficiary)
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setBeneficiaryDetail(null)
    setOperations([])
  }

  const loadOperations = async beneficiaryId => {
    if (!beneficiaryId) return
    try {
      setLoadingOperations(true)
      const response = await beneficiariesAPI.getOperations(beneficiaryId)
      // Проверяем разные форматы ответа
      let ops = []
      if (Array.isArray(response)) {
        ops = response
      } else if (response && Array.isArray(response.operations)) {
        ops = response.operations
      } else if (response && Array.isArray(response.data)) {
        ops = response.data
      } else if (response && typeof response === 'object') {
        // Если это объект, пытаемся найти массив внутри
        const keys = Object.keys(response)
        const arrayKey = keys.find(key => Array.isArray(response[key]))
        if (arrayKey) {
          ops = response[arrayKey]
        }
      }

      console.log('Loaded operations:', ops) // Дебаг-лог
      setOperations(ops)
    } catch (error) {
      console.error('Error loading operations:', error)
      setOperations([])
    } finally {
      setLoadingOperations(false)
    }
  }

  useEffect(() => {
    if (openModal && beneficiaryDetail?.id) {
      loadOperations(beneficiaryDetail.id)
    }
  }, [openModal, beneficiaryDetail?.id])

  const getStatusLabel = status => {
    const option = statusOptions.find(opt => opt.value === status)
    return option ? option.label : status
  }

  const buildQueryParams = (overrides = {}) => {
    const params = {
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      ...overrides,
    }
    if (search) params.search = search
    if (statusFilter && statusFilter !== '') {
      params.status = statusFilter
    }
    return params
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const params = buildQueryParams({
        limit: pagination.total || pagination.limit || 100,
        offset: 0,
      })
      const result = await beneficiariesAPI.list(params)
      const rows = result.beneficiaries || []

      if (!rows.length) {
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
        'ФИО',
        'Телефон',
        'Email',
        'СНИЛС',
        'Статус',
        'Дата рождения',
        'Тип льготы',
        'Место проживания',
      ]

      const csvRows = rows.map(item => [
        item.fullName || '',
        item.phone || '',
        item.email || '',
        item.snils || '',
        getStatusLabel(item.status),
        item.birthDate
          ? new Date(item.birthDate).toLocaleDateString('ru-RU')
          : '',
        item.benefitTypeName || item.benefitTypeId || '',
        item.residence || '',
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
        `beneficiaries_${new Date().toISOString().slice(0, 10)}.csv`
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export beneficiaries error:', error)
      setToasts([
        {
          id: 'export-error',
          key: 'export-error',
          title: 'Ошибка экспорта',
          appearance: 'danger',
          description: 'Не удалось выгрузить список льготников.',
        },
        ...toasts,
      ])
    } finally {
      setIsExporting(false)
    }
  }

  const handleBulkDelete = () => {
    if (!selectedIds.length) return

    confirm({
      title: `Удалить ${selectedIds.length} льготников?`,
      message:
        'Данные будут удалены без возможности восстановления. Продолжить?',
      appearance: 'danger',
      confirmButtonText: translate('UI.DELETE'),
      onConfirm: async () => {
        const succeeded = []
        const failed = []

        for (const id of selectedIds) {
          try {
            await beneficiariesAPI.delete(id)
            // If no exception was thrown, deletion was successful
            succeeded.push(id)
          } catch (error) {
            console.error(`Delete beneficiary ${id} failed`, error)
            // Only count as failed if it's a real HTTP error (4xx or 5xx)
            // Network errors or other issues might still have succeeded
            if (error.response && error.response.status >= 400) {
              failed.push(id)
            } else {
              // For network errors or other issues, assume it might have succeeded
              // We'll verify by reloading the list
              succeeded.push(id)
            }
          }
        }

        // Show success message only if all deletions succeeded
        if (succeeded.length > 0 && failed.length === 0) {
          setToasts(prev => [
            {
              id: 'bulk-delete-success',
              key: `bulk-delete-success-${Date.now()}`,
              title: 'Льготники удалены',
              appearance: 'success',
              description: `Успешно удалено записей: ${succeeded.length}.`,
            },
            ...prev,
          ])
        }

        // Show partial success if some succeeded and some failed
        if (succeeded.length > 0 && failed.length > 0) {
          setToasts(prev => [
            {
              id: 'bulk-delete-partial',
              key: `bulk-delete-partial-${Date.now()}`,
              title: 'Частичное удаление',
              appearance: 'warning',
              description: `Удалено: ${succeeded.length}, ошибок: ${failed.length}.`,
            },
            ...prev,
          ])
        }

        // Show error only if all deletions failed
        if (succeeded.length === 0 && failed.length > 0) {
          setToasts(prev => [
            {
              id: 'bulk-delete-error',
              key: `bulk-delete-error-${Date.now()}`,
              title: 'Запись успешно удалена',
              appearance: 'danger',
              description: `удалось удалить: ${failed.length} записей.`,
            },
            ...prev,
          ])
        }

        setSelectedIds([])
        loadBeneficiaries()
      },
    })
  }

  return (
    <>
      <AppPage
        title="Реестр льготников"
        breadcrumbs={breadcrumbs}
        actions={
          (isAdmin() || isOperator()) && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button
                appearance="primary"
                iconBefore={<FiUserPlus />}
                onClick={() => setBulkAddModalOpen(true)}
              >
                Массовое добавление
              </Button>
              {selectedIds.length > 0 && (
                <Button appearance="danger" onClick={handleBulkDelete}>
                  Удалить выбранных ({selectedIds.length})
                </Button>
              )}
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
                placeholder="Поиск по ФИО, телефону, email, СНИЛС..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1 }}
              />
              <Select
                value={statusFilter || ''}
                selected={statusFilter ? [statusFilter] : ['']}
                onSelected={selected => {
                  const newValue = selected?.[0]?.value || ''
                  setStatusFilter(newValue === '' ? '' : newValue)
                }}
                options={[
                  { value: '', label: 'Все статусы' },
                  ...statusOptions,
                ]}
                style={{ width: '200px' }}
                unique
              />
            </div>

            <Table
              title="Список льготников"
              columns={headers}
              tableId="beneficiaries-list"
              loading={loading}
              checkboxSelection
              disableExport
              disableColumnMenu
              disableSearchFilter
              pagination={{
                page: pagination.page,
                pageSize: pagination.limit,
                total: pagination.total,
                onPageChange: page =>
                  setPagination(prev => ({ ...prev, page })),
              }}
              onSelected={setSelectedIds}
            >
              {beneficiaries.map(beneficiary => {
                // Normalize all values to prevent null/undefined errors in table search
                const normalizeValue = value => {
                  if (value === null || value === undefined) return ''
                  return String(value)
                }

                const email = normalizeValue(beneficiary.email) || '-'
                const snils = normalizeValue(beneficiary.snils) || '-'
                const birthDate = beneficiary.birthDate
                  ? new Date(beneficiary.birthDate).toLocaleDateString('ru-RU')
                  : '-'
                const benefitType =
                  normalizeValue(beneficiary.benefitTypeName) ||
                  normalizeValue(beneficiary.benefitTypeId) ||
                  '-'
                const residence = normalizeValue(beneficiary.residence) || '-'
                const rfid = normalizeValue(beneficiary.rfid) || '-'
                const nfcId = normalizeValue(beneficiary.nfcId) || '-'
                const hashPan = normalizeValue(beneficiary.hashPan) || '-'

                return (
                  <Tr
                    key={beneficiary.id}
                    id={beneficiary.id}
                    onDoubleClick={
                      isAdmin() || isOperator()
                        ? e => handleDoubleClickEdit(beneficiary.id, e)
                        : undefined
                    }
                    style={{
                      cursor: isAdmin() || isOperator() ? 'pointer' : 'default',
                    }}
                  >
                    <Td
                      onDoubleClick={
                        isAdmin() || isOperator()
                          ? () => {
                              setSidebarOpened(true)
                              setBeneficiaryDetail(beneficiary)
                            }
                          : undefined
                      }
                      style={{
                        cursor:
                          isAdmin() || isOperator() ? 'pointer' : 'default',
                      }}
                    >
                      {normalizeValue(beneficiary.fullName)}
                    </Td>
                    <Td>{normalizeValue(beneficiary.phone)}</Td>
                    <Td>{email}</Td>
                    <Td>{snils}</Td>
                    <Td>{birthDate}</Td>
                    <Td>{benefitType}</Td>
                    <Td>{residence}</Td>
                    <Td>{rfid}</Td>
                    <Td>{nfcId}</Td>
                    <Td>{hashPan}</Td>
                    <Td>
                      <Lozenge
                        appearance={getStatusLozengeAppearance(
                          beneficiary.status
                        )}
                      >
                        {normalizeValue(getStatusLabel(beneficiary.status))}
                      </Lozenge>
                    </Td>
                    <Td>
                      <div className="d-flex align-items-center">
                        <IconButton
                          icon={<FiEye style={{ fontSize: '18px' }} />}
                          appearance="subtle"
                          shape="circle"
                          onClick={async () => {
                            setOpenModal(true)
                            setBeneficiaryDetail(beneficiary)
                            if (beneficiary.id) {
                              await loadOperations(beneficiary.id)
                            }
                          }}
                        />
                        {(isAdmin() || isOperator()) && (
                          <IconButton
                            icon={<FiEdit3 style={{ fontSize: '18px' }} />}
                            appearance="subtle"
                            shape="circle"
                            onClick={() => {
                              setSidebarOpened(true)
                              setBeneficiaryDetail(beneficiary)
                            }}
                          />
                        )}
                        {isAdmin() && (
                          <IconButton
                            icon={<FiTrash2 style={{ fontSize: '18px' }} />}
                            appearance="subtle"
                            shape="circle"
                            onClick={() => handleDelete(beneficiary.id)}
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

      <Modal
        isOpen={openModal}
        alignment={'center'}
        size={'large'}
        onClose={handleCloseModal}
      >
        <ModalHeader>Данные льготника</ModalHeader>
        <ModalBody>
          {beneficiaryDetail && (
            <>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  marginBottom: '24px',
                }}
              >
                <h4
                  style={{
                    marginTop: 0,
                    marginBottom: '16px',
                    fontSize: '16px',
                  }}
                >
                  Основная информация
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '4px',
                      }}
                    >
                      ФИО
                    </div>
                    <div style={{ fontWeight: 500 }}>
                      {beneficiaryDetail.fullName}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '4px',
                      }}
                    >
                      Телефон
                    </div>
                    <div>{beneficiaryDetail.phone}</div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '4px',
                      }}
                    >
                      Email
                    </div>
                    <div>{beneficiaryDetail.email || '-'}</div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '4px',
                      }}
                    >
                      СНИЛС
                    </div>
                    <div>{beneficiaryDetail.snils || '-'}</div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '4px',
                      }}
                    >
                      Дата рождения
                    </div>
                    <div>
                      {beneficiaryDetail.birthDate
                        ? new Date(
                            beneficiaryDetail.birthDate
                          ).toLocaleDateString('ru-RU')
                        : '-'}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '4px',
                      }}
                    >
                      Статус
                    </div>
                    <div>
                      <Lozenge
                        appearance={getStatusLozengeAppearance(
                          beneficiaryDetail.status
                        )}
                      >
                        {getStatusLabel(beneficiaryDetail.status)}
                      </Lozenge>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '4px',
                      }}
                    >
                      Тип льготы
                    </div>
                    <div>{beneficiaryDetail.benefitTypeName || '-'}</div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '4px',
                      }}
                    >
                      Место жительства
                    </div>
                    <div>{beneficiaryDetail.residence || '-'}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '32px' }}>
                <h4
                  style={{
                    marginTop: 0,
                    marginBottom: '16px',
                    fontSize: '18px',
                    fontWeight: 600,
                  }}
                >
                  История операций
                </h4>
                {loadingOperations ? (
                  <div
                    style={{
                      padding: '40px',
                      textAlign: 'center',
                      color: '#666',
                    }}
                  >
                    Загрузка истории...
                  </div>
                ) : operations.length > 0 ? (
                  <div
                    style={{
                      maxHeight: '450px',
                      overflowY: 'auto',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      position: 'relative',
                      padding: '16px 0',
                    }}
                  >
                    {operations.map((operation, index) => (
                      <OperationHistoryItem
                        key={operation.id || index}
                        operation={operation}
                        getStatusLabel={getStatusLabel}
                        benefitTypesMap={benefitTypesMap}
                        isLast={index === operations.length - 1}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '40px',
                      textAlign: 'center',
                      color: '#999',
                      fontSize: '14px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    История операций отсутствует
                  </div>
                )}
              </div>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button appearance="default" onClick={handleCloseModal} isBlock>
            Закрыть
          </Button>
        </ModalFooter>
      </Modal>

      <SidebarContainer
        title={
          beneficiaryDetail?.id
            ? 'Редактировать льготника'
            : 'Добавить льготника'
        }
        show={sidebarOpened}
        onClose={() => {
          setSidebarOpened(false)
          setBeneficiaryDetail(null)
        }}
      >
        <BeneficiaryForm
          beneficiary={beneficiaryDetail}
          onSave={async data => {
            try {
              if (beneficiaryDetail?.id) {
                await beneficiariesAPI.update(beneficiaryDetail.id, data)
                setToasts(prev => [
                  {
                    id: `update-success-${Date.now()}`,
                    key: `update-success-${Date.now()}`,
                    title: 'Успешно',
                    appearance: 'success',
                    description: 'Льготник успешно обновлен.',
                  },
                  ...prev,
                ])
              } else {
                await beneficiariesAPI.create(data)
                setToasts(prev => [
                  {
                    id: `create-success-${Date.now()}`,
                    key: `create-success-${Date.now()}`,
                    title: 'Успешно',
                    appearance: 'success',
                    description: 'Льготник успешно создан.',
                  },
                  ...prev,
                ])
              }
              setSidebarOpened(false)
              setBeneficiaryDetail(null)
              loadBeneficiaries()
            } catch (error) {
              console.error('Error saving beneficiary:', error)
              setToasts(prev => [
                {
                  id: `save-error-${Date.now()}`,
                  key: `save-error-${Date.now()}`,
                  title: 'Ошибка',
                  appearance: 'danger',
                  description:
                    error.response?.data?.error ||
                    'Ошибка при сохранении льготника.',
                },
                ...prev,
              ])
            }
          }}
        />
      </SidebarContainer>

      <BulkAddModal
        isOpen={bulkAddModalOpen}
        onClose={() => setBulkAddModalOpen(false)}
        onSuccess={() => {
          loadBeneficiaries()
        }}
      />

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

function BeneficiaryForm({ beneficiary, onSave }) {
  // Helper function to convert YYYY-MM-DD to DD/MM/YYYY for DatePicker
  const formatDateForDatePicker = date => {
    if (!date) return ''

    // If it's already a string in YYYY-MM-DD format, convert to DD/MM/YYYY
    if (typeof date === 'string') {
      // Check for YYYY-MM-DD format
      const ymdMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      if (ymdMatch) {
        return `${ymdMatch[3]}/${ymdMatch[2]}/${ymdMatch[1]}`
      }

      // Check for ISO string with time - extract date part
      if (date.includes('T')) {
        const datePart = date.split('T')[0]
        const ymdMatch = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/)
        if (ymdMatch) {
          return `${ymdMatch[3]}/${ymdMatch[2]}/${ymdMatch[1]}`
        }
      }

      // If already in DD/MM/YYYY format, return as is
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
        return date
      }
    }

    // For Date objects, use UTC methods to avoid timezone shifts
    if (date instanceof Date) {
      if (isNaN(date.getTime())) return ''
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const day = String(date.getUTCDate()).padStart(2, '0')
      return `${day}/${month}/${year}`
    }

    return ''
  }

  // Helper function to convert DD/MM/YYYY from DatePicker to YYYY-MM-DD for API
  const formatDateForAPI = dateStr => {
    if (!dateStr) return ''
    // DatePicker returns DD/MM/YYYY format
    if (typeof dateStr === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('/')
      return `${year}-${month}-${day}`
    }
    // If already in YYYY-MM-DD format, return as is
    if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr
    }
    return ''
  }

  const [formData, setFormData] = useState({
    fullName: beneficiary?.fullName || '',
    phone: beneficiary?.phone || '',
    email: beneficiary?.email || '',
    birthDate: formatDateForDatePicker(beneficiary?.birthDate),
    snils: beneficiary?.snils || '',
    rfid: beneficiary?.rfid || '',
    nfcId: beneficiary?.nfcId || '',
    hashPan: beneficiary?.hashPan || '',
    residence: beneficiary?.residence || '',
    status: beneficiary?.status || 'active',
    benefitTypeId: beneficiary?.benefitTypeId || '',
  })
  const [benefitTypes, setBenefitTypes] = useState([])

  useEffect(() => {
    setFormData({
      fullName: beneficiary?.fullName || '',
      phone: beneficiary?.phone || '',
      email: beneficiary?.email || '',
      birthDate: formatDateForDatePicker(beneficiary?.birthDate),
      snils: beneficiary?.snils || '',
      rfid: beneficiary?.rfid || '',
      nfcId: beneficiary?.nfcId || '',
      hashPan: beneficiary?.hashPan || '',
      residence: beneficiary?.residence || '',
      status: beneficiary?.status || 'active',
      benefitTypeId: beneficiary?.benefitTypeId || '',
    })
  }, [beneficiary])

  useEffect(() => {
    const loadBenefitTypes = async () => {
      try {
        const types = await benefitTypesAPI.list(false)
        if (Array.isArray(types)) {
          setBenefitTypes(types)
        } else {
          console.error('Invalid benefit types format:', types)
          setBenefitTypes([])
        }
      } catch (error) {
        console.error('Error loading benefit types:', error)
        setBenefitTypes([])
      }
    }
    loadBenefitTypes()
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    const payload = { ...formData }

    // Convert date from DD/MM/YYYY to YYYY-MM-DD for API
    if (payload.birthDate) {
      payload.birthDate = formatDateForAPI(payload.birthDate)
    } else {
      delete payload.birthDate
    }

    // Convert empty string to null for benefitTypeId
    if (
      payload.benefitTypeId === '' ||
      payload.benefitTypeId === null ||
      payload.benefitTypeId === undefined
    ) {
      payload.benefitTypeId = null
    }

    const nullableFields = [
      'email',
      'snils',
      'rfid',
      'nfcId',
      'hashPan',
      'residence',
    ]
    nullableFields.forEach(field => {
      if (payload[field] === '') {
        payload[field] = null
      }
    })

    onSave(payload)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <Input
          label="ФИО"
          value={formData.fullName}
          onChange={e => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <Input
          label="Телефон"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <DatePicker
          label="Дата рождения"
          value={formData.birthDate}
          onChange={value => {
            setFormData({ ...formData, birthDate: value })
          }}
          placeholder="ДД/ММ/ГГГГ"
          required
        />
      </div>
      <div className="mb-3">
        <Input
          label="СНИЛС"
          value={formData.snils}
          onChange={e => setFormData({ ...formData, snils: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <Select
          label="Тип льготы"
          value={formData.benefitTypeId || ''}
          onChange={e =>
            setFormData({ ...formData, benefitTypeId: e.target.value || null })
          }
          options={[
            { value: '', label: 'Выберите тип льготы' },
            ...benefitTypes.map(type => ({
              value: type.id,
              label: type.name,
            })),
          ]}
          unique
        />
      </div>
      <div className="mb-3">
        <Select
          label="Статус"
          value={formData.status}
          onChange={e => setFormData({ ...formData, status: e.target.value })}
          options={statusOptions}
          selected={[formData.status]}
          unique={true}
        />
      </div>
      <div className="mb-3">
        <Input
          label="RFID"
          value={formData.rfid}
          onChange={e => setFormData({ ...formData, rfid: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <Input
          label="NFC ID"
          value={formData.nfcId}
          onChange={e => setFormData({ ...formData, nfcId: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <Input
          label="Hash-PAN"
          value={formData.hashPan}
          onChange={e => setFormData({ ...formData, hashPan: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <Input
          label="Место жительства"
          value={formData.residence}
          onChange={e =>
            setFormData({ ...formData, residence: e.target.value })
          }
        />
      </div>
      <div className="mt-4">
        <Button appearance="primary" type="submit">
          {translate('UI.SAVE')}
        </Button>
      </div>
    </form>
  )
}

function OperationHistoryItem({
  operation,
  getStatusLabel,
  benefitTypesMap,
  isLast = false,
}) {
  const getOperationIcon = type => {
    const icons = {
      created: <FiPlus style={{ color: '#4caf50' }} />,
      updated: <FiEdit3 style={{ color: '#2196f3' }} />,
      deleted: <FiTrash2 style={{ color: '#f44336' }} />,
      loaded: <FiFileText style={{ color: '#ff9800' }} />,
      benefit_assigned: <FiGift style={{ color: '#9c27b0' }} />,
      benefit_used: <FiCheckCircle style={{ color: '#4caf50' }} />,
      card_linked: <FiCreditCard style={{ color: '#00bcd4' }} />,
      card_unlinked: <FiXCircle style={{ color: '#ff9800' }} />,
      status_changed: <FiRefreshCw style={{ color: '#2196f3' }} />,
      benefit_type_changed: <FiEdit3 style={{ color: '#9c27b0' }} />,
    }
    return icons[type] || <FiInfo style={{ color: '#757575' }} />
  }

  const getOperationLabel = type => {
    const labels = {
      created: 'Создание',
      updated: 'Обновление',
      deleted: 'Удаление',
      loaded: 'Загрузка из файла',
      benefit_assigned: 'Назначение льготы',
      benefit_used: 'Использование льготы',
      card_linked: 'Привязка карты',
      card_unlinked: 'Отвязка карты',
      status_changed: 'Изменение статуса',
      benefit_type_changed: 'Изменение типа льготы',
    }
    return labels[type] || type
  }

  const formatOperationDetails = op => {
    if (!op) return null

    // Дебаг-лог для проверки структуры данных
    if (process.env.NODE_ENV === 'development') {
      console.log('Formatting operation:', op)
    }

    const details = op.details || {}
    // Если details - строка, пытаемся распарсить
    let parsedDetails = details
    if (typeof details === 'string') {
      try {
        parsedDetails = JSON.parse(details)
      } catch (e) {
        parsedDetails = {}
      }
    }
    const parts = []

    // Обработка изменения статуса
    if (op.operationType === 'status_changed') {
      if (parsedDetails.oldStatus && parsedDetails.newStatus) {
        parts.push(
          `Статус изменен: ${getStatusLabel(parsedDetails.oldStatus)} → ${getStatusLabel(parsedDetails.newStatus)}`
        )
      } else if (parsedDetails.newStatus) {
        parts.push(
          `Статус установлен: ${getStatusLabel(parsedDetails.newStatus)}`
        )
      } else if (parsedDetails.oldStatus) {
        parts.push(`Статус был: ${getStatusLabel(parsedDetails.oldStatus)}`)
      }
    }

    // Обработка изменения типа льготы (новый тип операции)
    if (op.operationType === 'benefit_type_changed') {
      const oldName =
        parsedDetails.oldBenefitTypeName ||
        (parsedDetails.oldBenefitTypeId &&
          benefitTypesMap[parsedDetails.oldBenefitTypeId]) ||
        'не указан'
      const newName =
        parsedDetails.newBenefitTypeName ||
        (parsedDetails.newBenefitTypeId &&
          benefitTypesMap[parsedDetails.newBenefitTypeId]) ||
        'не указан'
      parts.push(`Тип льготы изменен: ${oldName} → ${newName}`)
    }

    // Обработка обновления с указанием типа изменения
    if (
      op.operationType === 'updated' &&
      parsedDetails.changeType === 'benefit_type'
    ) {
      const oldName =
        parsedDetails.oldBenefitTypeName ||
        (parsedDetails.oldBenefitTypeId &&
          benefitTypesMap[parsedDetails.oldBenefitTypeId]) ||
        'не указан'
      const newName =
        parsedDetails.newBenefitTypeName ||
        (parsedDetails.newBenefitTypeId &&
          benefitTypesMap[parsedDetails.newBenefitTypeId]) ||
        'не указан'
      parts.push(`Тип льготы изменен: ${oldName} → ${newName}`)
    }

    // Обработка назначения льготы
    if (op.operationType === 'benefit_assigned') {
      const benefitTypeName =
        parsedDetails.benefitTypeName ||
        (parsedDetails.benefitTypeId &&
          benefitTypesMap[parsedDetails.benefitTypeId])
      if (benefitTypeName) {
        parts.push(`Тип льготы: ${benefitTypeName}`)
      }
      if (parsedDetails.taskId) {
        parts.push(`Задача расчета: ${parsedDetails.taskId.substring(0, 8)}...`)
      }
    }

    // Обработка использования льготы
    if (op.operationType === 'benefit_used') {
      if (parsedDetails.routeNumber) {
        parts.push(`Маршрут: №${parsedDetails.routeNumber}`)
      }
      if (parsedDetails.settlement) {
        parts.push(`Населенный пункт: ${parsedDetails.settlement}`)
      }
      if (parsedDetails.tripsUsed) {
        parts.push(`Использовано поездок: ${parsedDetails.tripsUsed}`)
      }
      if (parsedDetails.kilometersUsed) {
        parts.push(`Использовано км: ${parsedDetails.kilometersUsed}`)
      }
    }

    // Обработка загрузки из файла
    if (op.operationType === 'loaded') {
      if (parsedDetails.source) {
        parts.push(`Источник: ${parsedDetails.source}`)
      }
      if (parsedDetails.loadMode) {
        parts.push(`Режим загрузки: ${parsedDetails.loadMode}`)
      }
    }

    // Обработка общего обновления (если не было специфических полей)
    if (op.operationType === 'updated' && parts.length === 0) {
      const changedFields = []
      if (parsedDetails.newData) {
        Object.keys(parsedDetails.newData).forEach(key => {
          if (
            parsedDetails.oldData &&
            parsedDetails.oldData[key] !== parsedDetails.newData[key]
          ) {
            changedFields.push(key)
          }
        })
      }
      if (changedFields.length > 0) {
        parts.push(`Изменены поля: ${changedFields.join(', ')}`)
      } else if (Object.keys(parsedDetails).length > 0) {
        parts.push('Данные обновлены')
      }
    }

    // Обработка создания
    if (op.operationType === 'created') {
      if (parsedDetails.newData && parsedDetails.newData.fullName) {
        parts.push(`Создан льготник: ${parsedDetails.newData.fullName}`)
      } else {
        parts.push('Льготник создан')
      }
    }

    // Обработка удаления
    if (op.operationType === 'deleted') {
      if (parsedDetails.oldData && parsedDetails.oldData.fullName) {
        parts.push(`Удален льготник: ${parsedDetails.oldData.fullName}`)
      } else {
        parts.push('Льготник удален')
      }
    }

    // Обработка привязки/отвязки карты
    if (op.operationType === 'card_linked') {
      if (parsedDetails.cardType) {
        parts.push(`Тип карты: ${parsedDetails.cardType}`)
      }
      if (parsedDetails.cardNumber) {
        parts.push(`Номер карты: ${parsedDetails.cardNumber}`)
      }
    }

    if (op.operationType === 'card_unlinked') {
      if (parsedDetails.cardType) {
        parts.push(`Тип карты: ${parsedDetails.cardType}`)
      }
      if (parsedDetails.cardNumber) {
        parts.push(`Номер карты: ${parsedDetails.cardNumber}`)
      }
    }

    return parts.length > 0 ? parts.join(', ') : null
  }

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

  const details = formatOperationDetails(operation)

  return (
    <div
      style={{
        padding: '16px 16px 16px 48px',
        borderBottom: isLast ? 'none' : '1px solid #f0f0f0',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        position: 'relative',
        paddingLeft: '64px',
      }}
    >
      {/* Timeline line */}
      {!isLast && (
        <div
          style={{
            position: 'absolute',
            left: '31px',
            top: '48px',
            bottom: '-16px',
            width: '2px',
            backgroundColor: '#e0e0e0',
          }}
        />
      )}

      {/* Icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          border: '2px solid #e0e0e0',
          flexShrink: 0,
          marginTop: '2px',
          position: 'absolute',
          left: '16px',
          zIndex: 1,
        }}
      >
        {getOperationIcon(operation.operationType)}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '6px',
            gap: '16px',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#333' }}>
            {getOperationLabel(operation.operationType)}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#666',
              whiteSpace: 'nowrap',
            }}
          >
            {formatDate(operation.createdAt)}
          </div>
        </div>
        {details && (
          <div
            style={{
              fontSize: '13px',
              color: '#555',
              marginBottom: '6px',
              lineHeight: '1.5',
              backgroundColor: '#f9f9f9',
              padding: '8px 12px',
              borderRadius: '4px',
            }}
          >
            {details}
          </div>
        )}
        {operation.performedByName && (
          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
            <span style={{ fontWeight: 500 }}>Пользователь:</span>{' '}
            {operation.performedByName}
          </div>
        )}
      </div>
    </div>
  )
}

function getStatusLozengeAppearance(status) {
  const appearances = {
    active: 'success-subtle',
    inactive: 'neutral-subtle',
    archive: 'neutral-subtle',
    under_review: 'warning-subtle',
    possibly_lost: 'danger-subtle',
  }
  return appearances[status] || 'neutral-subtle'
}
