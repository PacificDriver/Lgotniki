import React, { useEffect, useMemo, useState } from 'react'
import Button from '../../../components/BaseUI/Button'
import IconButton from '../../../components/BaseUI/Button/IconButton'
import Input from '../../../components/BaseUI/Input'
import { Table, Td, Tr } from '../../../components/BaseUI/Table'
import Lozenge from '../../../components/BaseUI/Lozenge'
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '../../../components/BaseUI/Modal'
import { Toast, ToastContainer } from '../../../components/CustomUI/Toast'
import { FiEdit3, FiTrash2 } from 'react-icons/fi'

import { operatorsAPI } from '../../../services/api'
import { useModalConfirm as confirmModal } from '../../../hooks/useModalConfirm'
import useDebounce from '../../../hooks/useDebounce'
import Select from '../../../components/BaseUI/Select'

const statusOptions = [
  { label: 'Активен', value: 'true' },
  { label: 'Заблокирован', value: 'false' },
]

const initialForm = {
  username: '',
  fullName: '',
  email: '',
  password: '',
  isActive: true,
}

export default function OperatorsManager() {
  const [operators, setOperators] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentOperator, setCurrentOperator] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState()

  const columns = useMemo(
    () => [
      { name: 'ФИО', dataType: 'text' },
      { name: 'Логин', dataType: 'text' },
      { name: 'Email', dataType: 'text' },
      { name: 'Статус', dataType: 'text' },
      { name: 'Действия' },
    ],
    []
  )

  const loadOperators = async () => {
    setLoading(true)
    try {
      const params = {}
      if (debouncedSearch) params.search = debouncedSearch
      const data = await operatorsAPI.list(params)
      setOperators(data)
    } catch (error) {
      console.error('Не удалось загрузить операторов', error)
      setToast({
        id: 'operators-load-error',
        key: Date.now(),
        title: 'Ошибка загрузки',
        appearance: 'danger',
        description:
          'Не удалось загрузить список операторов. Попробуйте позже.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOperators()
  }, [debouncedSearch])

  const openCreateModal = () => {
    setCurrentOperator(null)
    setForm(initialForm)
    setModalOpen(true)
  }

  const openEditModal = operator => {
    setCurrentOperator(operator)
    setForm({
      username: operator.username,
      fullName: operator.fullName,
      email: operator.email,
      password: '',
      isActive: operator.isActive,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setCurrentOperator(null)
    setForm(initialForm)
  }

  const handleSave = async event => {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        isActive: form.isActive,
      }

      if (!currentOperator) {
        payload.username = form.username
        payload.password = form.password
      } else if (form.password) {
        payload.password = form.password
      }

      if (!payload.password && !currentOperator) {
        setToast({
          id: 'password-required',
          key: Date.now(),
          title: 'Не заполнен пароль',
          appearance: 'danger',
          description: 'Для нового оператора необходимо задать пароль.',
        })
        setSaving(false)
        return
      }

      if (currentOperator) {
        await operatorsAPI.update(currentOperator.id, payload)
      } else {
        await operatorsAPI.create(payload)
      }

      setToast({
        id: 'operators-success',
        key: Date.now(),
        title: currentOperator ? 'Оператор обновлен' : 'Оператор создан',
        appearance: 'success',
      })
      closeModal()
      loadOperators()
    } catch (error) {
      console.error('Ошибка сохранения оператора', error)
      setToast({
        id: 'operators-error',
        key: Date.now(),
        title: 'Не удалось сохранить оператора',
        appearance: 'danger',
        description:
          error?.response?.data?.error ||
          'Проверьте введенные данные или попробуйте чуть позже.',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = operator => {
    confirmModal({
      title: `Удалить оператора «${operator.fullName}»?`,
      message: 'Действие необратимо. Пользователь потеряет доступ к системе.',
      appearance: 'danger',
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена',
      onConfirm: async () => {
        try {
          await operatorsAPI.delete(operator.id)
          setToast({
            id: 'operator-deleted',
            key: Date.now(),
            title: 'Оператор удален',
            appearance: 'success',
          })
          loadOperators()
        } catch (error) {
          console.error('Ошибка удаления оператора', error)
          setToast({
            id: 'operator-delete-error',
            key: Date.now(),
            title: 'Не удалось удалить оператора',
            appearance: 'danger',
          })
        }
      },
    })
  }

  return (
    <div className="card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-1">Операторы</h5>
          <p className="text-muted mb-0">
            Управляйте пользователями с ролью «оператор»: добавляйте,
            редактируйте или удаляйте доступы.
          </p>
        </div>
        <Button appearance="primary" onClick={openCreateModal}>
          Добавить оператора
        </Button>
      </div>

      <div className="d-flex gap-2 mb-3">
        <Input
          placeholder="Поиск по ФИО, логину, email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      <Table
        title="Список операторов"
        columns={columns}
        tableId="operators-table"
        loading={loading}
        checkboxSelection={false}
        disableColumnMenu
        disableSearchFilter
        disableExport
      >
        {operators.map(operator => {
          // Normalize all values to prevent null/undefined errors in table search
          const normalizeValue = value => {
            if (value === null || value === undefined) return ''
            return String(value)
          }

          return (
            <Tr key={operator.id} id={operator.id}>
              <Td>{normalizeValue(operator.fullName)}</Td>
              <Td>{normalizeValue(operator.username)}</Td>
              <Td>{normalizeValue(operator.email)}</Td>
              <Td>
                <Lozenge
                  appearance={
                    operator.isActive ? 'success-subtle' : 'danger-subtle'
                  }
                >
                  {normalizeValue(
                    operator.isActive ? 'Активен' : 'Заблокирован'
                  )}
                </Lozenge>
              </Td>
              <Td>
                <div className="d-flex gap-1">
                  <IconButton
                    icon={<FiEdit3 style={{ fontSize: '18px' }} />}
                    appearance="subtle"
                    shape="circle"
                    onClick={() => openEditModal(operator)}
                  />
                  <IconButton
                    icon={<FiTrash2 style={{ fontSize: '18px' }} />}
                    appearance="subtle"
                    shape="circle"
                    onClick={() => handleDelete(operator)}
                  />
                </div>
              </Td>
            </Tr>
          )
        })}
      </Table>

      <Modal isOpen={modalOpen} width="medium" onClose={closeModal}>
        <ModalHeader>
          {currentOperator ? 'Редактировать оператора' : 'Новый оператор'}
        </ModalHeader>
        <form onSubmit={handleSave}>
          <ModalBody>
            <div className="mb-3">
              <Input
                label="Логин"
                value={form.username}
                onChange={event =>
                  setForm(prev => ({ ...prev, username: event.target.value }))
                }
                required
                disabled={!!currentOperator}
              />
            </div>
            <div className="mb-3">
              <Input
                label="ФИО"
                value={form.fullName}
                onChange={event =>
                  setForm(prev => ({ ...prev, fullName: event.target.value }))
                }
                required
              />
            </div>
            <div className="mb-3">
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={event =>
                  setForm(prev => ({ ...prev, email: event.target.value }))
                }
                required
              />
            </div>
            <div className="mb-3">
              <Input
                label={
                  currentOperator ? 'Новый пароль (необязательно)' : 'Пароль'
                }
                type="password"
                value={form.password}
                onChange={event =>
                  setForm(prev => ({ ...prev, password: event.target.value }))
                }
                required={!currentOperator}
              />
            </div>
            <div className="mb-3">
              <Select
                label="Статус"
                options={statusOptions}
                selected={[form.isActive ? 'true' : 'false']}
                unique
                onSelected={selected =>
                  setForm(prev => ({
                    ...prev,
                    isActive: selected?.[0] === 'true',
                  }))
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              appearance="subtle"
              onClick={event => {
                event.preventDefault()
                closeModal()
              }}
            >
              Отмена
            </Button>
            <Button appearance="primary" type="submit" disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

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
    </div>
  )
}
