import React, { useState, useEffect } from 'react'
import { beneficiariesAPI } from '../../../services/api'
import { useAuth } from '../../../services/useAuth'
import { translate } from '../../../hooks/translate'
import { useModalConfirm as confirm } from '../../../hooks/useModalConfirm'
import Button from '../../../components/BaseUI/Button'
import IconButton from '../../../components/BaseUI/Button/IconButton'
import Input from '../../../components/BaseUI/Input'
import Select from '../../../components/BaseUI/Select'
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
import { FiEdit3, FiEye, FiTrash2, FiUserPlus } from 'react-icons/fi'
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
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })
  const [openModal, setOpenModal] = useState(false)
  const [beneficiaryDetail, setBeneficiaryDetail] = useState(null)
  const [sidebarOpened, setSidebarOpened] = useState(false)
  const [bulkAddModalOpen, setBulkAddModalOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  const headers = [
    { name: 'ФИО', dataType: 'text' },
    { name: 'Телефон', dataType: 'text' },
    { name: 'Email', dataType: 'text' },
    { name: 'СНИЛС', dataType: 'text' },
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
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter

      const result = await beneficiariesAPI.list(params)
      setBeneficiaries(result.beneficiaries || [])
      setPagination(prev => ({ ...prev, total: result.total || 0 }))
    } catch (error) {
      console.error('Error loading beneficiaries:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBeneficiaries()
  }, [pagination.page, search, statusFilter])

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

  const handleCloseModal = () => {
    setOpenModal(false)
    setBeneficiaryDetail(null)
  }

  const getStatusLabel = status => {
    const option = statusOptions.find(opt => opt.value === status)
    return option ? option.label : status
  }

  return (
    <>
      <AppPage
        title="Реестр льготников"
        breadcrumbs={breadcrumbs}
        actions={
          (isAdmin() || isOperator()) && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                appearance="primary"
                iconBefore={<FiUserPlus />}
                onClick={() => setBulkAddModalOpen(true)}
              >
                Массовое добавление
              </Button>
              <Button
                appearance="default"
                onClick={() => {
                  setSidebarOpened(true)
                  setBeneficiaryDetail({})
                }}
              >
                Добавить льготника
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
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                options={[
                  { value: '', label: 'Все статусы' },
                  ...statusOptions,
                ]}
                style={{ width: '200px' }}
              />
            </div>

            <Table
              title="Список льготников"
              columns={headers}
              tableId="beneficiaries-list"
              loading={loading}
              checkboxSelection
              disableColumnMenu
              pagination={{
                page: pagination.page,
                pageSize: pagination.limit,
                total: pagination.total,
                onPageChange: page =>
                  setPagination(prev => ({ ...prev, page })),
              }}
            >
              {beneficiaries.map(beneficiary => (
                <Tr key={beneficiary.id} id={beneficiary.id}>
                  <Td>{beneficiary.fullName}</Td>
                  <Td>{beneficiary.phone}</Td>
                  <Td>{beneficiary.email || '-'}</Td>
                  <Td>{beneficiary.snils || '-'}</Td>
                  <Td>
                    <Lozenge
                      appearance={getStatusLozengeAppearance(
                        beneficiary.status
                      )}
                    >
                      {getStatusLabel(beneficiary.status)}
                    </Lozenge>
                  </Td>
                  <Td>
                    <div className="d-flex align-items-center">
                      <IconButton
                        icon={<FiEye style={{ fontSize: '18px' }} />}
                        appearance="subtle"
                        shape="circle"
                        onClick={() => {
                          setOpenModal(true)
                          setBeneficiaryDetail(beneficiary)
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
              ))}
            </Table>
          </ContainerItem>
        </Container>
      </AppPage>

      <Modal
        isOpen={openModal}
        alignment={'center'}
        size={'medium'}
        onClose={handleCloseModal}
      >
        <ModalHeader>Данные льготника</ModalHeader>
        <ModalBody>
          {beneficiaryDetail && (
            <>
              <div className="d-flex align-items-center gap-1 mb-3">
                <div className="weight-500">ФИО:</div>
                <div>{beneficiaryDetail.fullName}</div>
              </div>
              <div className="d-flex align-items-center gap-1 mb-3">
                <div className="weight-500">Телефон:</div>
                <div>{beneficiaryDetail.phone}</div>
              </div>
              <div className="d-flex align-items-center gap-1 mb-3">
                <div className="weight-500">Email:</div>
                <div>{beneficiaryDetail.email || '-'}</div>
              </div>
              <div className="d-flex align-items-center gap-1 mb-3">
                <div className="weight-500">СНИЛС:</div>
                <div>{beneficiaryDetail.snils || '-'}</div>
              </div>
              <div className="d-flex align-items-center gap-1 mb-3">
                <div className="weight-500">Дата рождения:</div>
                <div>
                  {beneficiaryDetail.birthDate
                    ? new Date(beneficiaryDetail.birthDate).toLocaleDateString(
                        'ru-RU'
                      )
                    : '-'}
                </div>
              </div>
              <div className="d-flex align-items-center gap-1 mb-3">
                <div className="weight-500">Статус:</div>
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
            </>
          )}
        </ModalBody>
        <ModalFooter></ModalFooter>
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
              } else {
                await beneficiariesAPI.create(data)
              }
              setSidebarOpened(false)
              loadBeneficiaries()
            } catch (error) {
              console.error('Error saving beneficiary:', error)
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
  const [formData, setFormData] = useState({
    fullName: beneficiary?.fullName || '',
    phone: beneficiary?.phone || '',
    email: beneficiary?.email || '',
    birthDate: beneficiary?.birthDate
      ? new Date(beneficiary.birthDate).toISOString().split('T')[0]
      : '',
    snils: beneficiary?.snils || '',
    rfid: beneficiary?.rfid || '',
    nfcId: beneficiary?.nfcId || '',
    hashPan: beneficiary?.hashPan || '',
    residence: beneficiary?.residence || '',
    status: beneficiary?.status || 'active',
  })

  const handleSubmit = e => {
    e.preventDefault()
    onSave({
      ...formData,
      birthDate: new Date(formData.birthDate),
    })
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
        <Input
          label="Дата рождения"
          type="date"
          value={formData.birthDate}
          onChange={e =>
            setFormData({ ...formData, birthDate: e.target.value })
          }
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
