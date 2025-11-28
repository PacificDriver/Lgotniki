import React, { useState, useEffect } from 'react'
import { beneficiariesAPI, benefitTypesAPI } from '../../../services/api'
import Button from '../../../components/BaseUI/Button'
import Input from '../../../components/BaseUI/Input'
import Select from '../../../components/BaseUI/Select'
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '../../../components/BaseUI/Modal'
import { Toast, ToastContainer } from '../../../components/CustomUI/Toast'
import { FiPlus, FiX } from 'react-icons/fi'

const statusOptions = [
  { value: 'active', label: 'Активен' },
  { value: 'inactive', label: 'Неактивен' },
  { value: 'archive', label: 'Архив' },
  { value: 'under_review', label: 'На проверке' },
  { value: 'possibly_lost', label: 'Возможно утратил льготу' },
]

export default function BulkAddModal({ isOpen, onClose, onSuccess }) {
  const [benefitTypes, setBenefitTypes] = useState([])
  const [entries, setEntries] = useState([
    {
      id: Date.now(),
      fullName: '',
      birthDate: '',
      phone: '',
      email: '',
      snils: '',
      hashPan: '',
      nfcId: '',
      rfid: '',
      benefitTypeId: '',
      status: 'active',
      residence: '',
    },
  ])
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      loadBenefitTypes()
      // Reset form when modal opens
      setEntries([
        {
          id: Date.now(),
          fullName: '',
          birthDate: '',
          phone: '',
          email: '',
          snils: '',
          hashPan: '',
          nfcId: '',
          rfid: '',
          benefitTypeId: '',
          status: 'active',
          residence: '',
        },
      ])
      setErrors({})
    }
  }, [isOpen])

  const loadBenefitTypes = async () => {
    try {
      const types = await benefitTypesAPI.list(false)
      if (Array.isArray(types)) {
        setBenefitTypes(
          types.map(t => ({
            value: t.id,
            label: t.name,
          }))
        )
      } else {
        console.error('Invalid benefit types format:', types)
        setBenefitTypes([])
      }
    } catch (error) {
      console.error('Error loading benefit types:', error)
      setBenefitTypes([])
    }
  }

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        id: Date.now() + entries.length,
        fullName: '',
        birthDate: '',
        phone: '',
        email: '',
        snils: '',
        hashPan: '',
        nfcId: '',
        rfid: '',
        benefitTypeId: '',
        status: 'active',
        residence: '',
      },
    ])
  }

  const removeEntry = id => {
    if (entries.length > 1) {
      setEntries(entries.filter(e => e.id !== id))
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }
  }

  const updateEntry = (id, field, value) => {
    setEntries(
      entries.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    )
    // Clear error for this field
    if (errors[id] && errors[id][field]) {
      setErrors(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: undefined,
        },
      }))
    }
  }

  const validateEntry = entry => {
    const entryErrors = {}
    if (!entry.fullName || entry.fullName.trim() === '') {
      entryErrors.fullName = 'ФИО обязательно'
    }
    if (!entry.birthDate) {
      entryErrors.birthDate = 'Дата рождения обязательна'
    }
    if (!entry.phone || entry.phone.trim() === '') {
      entryErrors.phone = 'Телефон обязателен'
    } else {
      // Basic phone validation
      const phoneRegex = /^[\d\s-+()]+$/
      if (!phoneRegex.test(entry.phone)) {
        entryErrors.phone = 'Неверный формат телефона'
      }
    }
    if (entry.email && entry.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(entry.email)) {
        entryErrors.email = 'Неверный формат email'
      }
    }
    return entryErrors
  }

  const handleSubmit = async () => {
    // Validate all entries
    const allErrors = {}
    let hasErrors = false

    entries.forEach(entry => {
      const entryErrors = validateEntry(entry)
      if (Object.keys(entryErrors).length > 0) {
        allErrors[entry.id] = entryErrors
        hasErrors = true
      }
    })

    if (hasErrors) {
      setErrors(allErrors)
      setToasts([
        {
          id: 'validation-error',
          key: 'validation-error',
          title: 'Ошибка валидации',
          description: 'Пожалуйста, исправьте ошибки в форме',
          appearance: 'danger',
        },
      ])
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const results = {
        success: [],
        errors: [],
      }

      // Create beneficiaries one by one
      for (const entry of entries) {
        try {
          const data = {
            fullName: entry.fullName.trim(),
            birthDate: entry.birthDate,
            phone: entry.phone.trim(),
            email: entry.email?.trim() || undefined,
            snils: entry.snils?.trim() || undefined,
            hashPan: entry.hashPan?.trim() || undefined,
            nfcId: entry.nfcId?.trim() || undefined,
            rfid: entry.rfid?.trim() || undefined,
            benefitTypeId:
              entry.benefitTypeId && entry.benefitTypeId !== ''
                ? entry.benefitTypeId
                : null,
            status: entry.status,
            residence: entry.residence?.trim() || undefined,
          }

          const beneficiary = await beneficiariesAPI.create(data)
          results.success.push({
            name: beneficiary.fullName,
            id: beneficiary.id,
          })
        } catch (error) {
          results.errors.push({
            name: entry.fullName || 'Неизвестно',
            error:
              error.response?.data?.error || error.message || 'Ошибка создания',
          })
        }
      }

      if (results.success.length > 0) {
        setToasts([
          {
            id: 'success',
            key: 'success',
            title: 'Успешно',
            description: `Создано льготников: ${results.success.length}${
              results.errors.length > 0
                ? `. Ошибок: ${results.errors.length}`
                : ''
            }`,
            appearance: 'success',
          },
        ])

        if (onSuccess) {
          onSuccess()
        }

        // Close modal immediately after success
        onClose()
      }

      if (results.errors.length > 0 && results.success.length === 0) {
        setToasts([
          {
            id: 'error',
            key: 'error',
            title: 'Ошибка',
            description: `Не удалось создать льготников. Проверьте данные.`,
            appearance: 'danger',
          },
        ])
      }
    } catch (error) {
      console.error('Error creating beneficiaries:', error)
      setToasts([
        {
          id: 'error',
          key: 'error',
          title: 'Ошибка',
          description:
            error.response?.data?.error || 'Ошибка при создании льготников',
          appearance: 'danger',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const removeToast = index => {
    const values = toasts
    values.splice(index, 1)
    setToasts([...values])
  }

  return (
    <>
      <Modal isOpen={isOpen} alignment="center" size="large" onClose={onClose}>
        <ModalHeader>
          <h2>Массовое добавление льготников</h2>
        </ModalHeader>
        <ModalBody>
          <div
            style={{ maxHeight: '70vh', overflowY: 'auto', padding: '10px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              <p style={{ margin: 0, color: '#666' }}>
                Добавлено записей: <strong>{entries.length}</strong>
              </p>
              <Button
                appearance="primary"
                iconBefore={<FiPlus />}
                onClick={addEntry}
              >
                Добавить еще
              </Button>
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
            >
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#fafafa',
                    position: 'relative',
                  }}
                >
                  {entries.length > 1 && (
                    <Button
                      appearance="subtle"
                      iconBefore={<FiX />}
                      onClick={() => removeEntry(entry.id)}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                      }}
                    >
                      Удалить
                    </Button>
                  )}

                  <h3
                    style={{
                      marginTop: 0,
                      marginBottom: '20px',
                      color: '#333',
                      fontSize: '16px',
                    }}
                  >
                    Льготник #{index + 1}
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '15px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '5px',
                          fontWeight: 500,
                        }}
                      >
                        ФИО <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Input
                        value={entry.fullName}
                        onChange={e =>
                          updateEntry(entry.id, 'fullName', e.target.value)
                        }
                        placeholder="Иванов Иван Иванович"
                        isInvalid={errors[entry.id]?.fullName}
                      />
                      {errors[entry.id]?.fullName && (
                        <span style={{ color: 'red', fontSize: '12px' }}>
                          {errors[entry.id].fullName}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '5px',
                          fontWeight: 500,
                        }}
                      >
                        Дата рождения <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Input
                        type="date"
                        value={entry.birthDate}
                        onChange={e =>
                          updateEntry(entry.id, 'birthDate', e.target.value)
                        }
                        isInvalid={errors[entry.id]?.birthDate}
                      />
                      {errors[entry.id]?.birthDate && (
                        <span style={{ color: 'red', fontSize: '12px' }}>
                          {errors[entry.id].birthDate}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '5px',
                          fontWeight: 500,
                        }}
                      >
                        Телефон <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Input
                        value={entry.phone}
                        onChange={e =>
                          updateEntry(entry.id, 'phone', e.target.value)
                        }
                        placeholder="+7 (999) 123-45-67"
                        isInvalid={errors[entry.id]?.phone}
                      />
                      {errors[entry.id]?.phone && (
                        <span style={{ color: 'red', fontSize: '12px' }}>
                          {errors[entry.id].phone}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '5px',
                          fontWeight: 500,
                        }}
                      >
                        Email
                      </label>
                      <Input
                        type="email"
                        value={entry.email}
                        onChange={e =>
                          updateEntry(entry.id, 'email', e.target.value)
                        }
                        placeholder="example@mail.ru"
                        isInvalid={errors[entry.id]?.email}
                      />
                      {errors[entry.id]?.email && (
                        <span style={{ color: 'red', fontSize: '12px' }}>
                          {errors[entry.id].email}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '5px',
                          fontWeight: 500,
                        }}
                      >
                        СНИЛС
                      </label>
                      <Input
                        value={entry.snils}
                        onChange={e =>
                          updateEntry(entry.id, 'snils', e.target.value)
                        }
                        placeholder="123-456-789 01"
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '5px',
                          fontWeight: 500,
                        }}
                      >
                        Тип льготы
                      </label>
                      <Select
                        value={entry.benefitTypeId || ''}
                        onChange={e =>
                          updateEntry(
                            entry.id,
                            'benefitTypeId',
                            e.target.value || null
                          )
                        }
                        options={[
                          { value: '', label: 'Не выбрано' },
                          ...benefitTypes,
                        ]}
                        unique
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '5px',
                          fontWeight: 500,
                        }}
                      >
                        Статус
                      </label>
                      <Select
                        value={entry.status}
                        onChange={e =>
                          updateEntry(entry.id, 'status', e.target.value)
                        }
                        options={statusOptions}
                        selected={[entry.status]}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '5px',
                          fontWeight: 500,
                        }}
                      >
                        Место жительства
                      </label>
                      <Input
                        value={entry.residence}
                        onChange={e =>
                          updateEntry(entry.id, 'residence', e.target.value)
                        }
                        placeholder="Город, улица, дом"
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '5px',
                          fontWeight: 500,
                        }}
                      >
                        Hash-PAN
                      </label>
                      <Input
                        value={entry.hashPan}
                        onChange={e =>
                          updateEntry(entry.id, 'hashPan', e.target.value)
                        }
                        placeholder="Хеш транспортной карты"
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '5px',
                          fontWeight: 500,
                        }}
                      >
                        NFC ID
                      </label>
                      <Input
                        value={entry.nfcId}
                        onChange={e =>
                          updateEntry(entry.id, 'nfcId', e.target.value)
                        }
                        placeholder="Идентификатор NFC"
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '5px',
                          fontWeight: 500,
                        }}
                      >
                        RFID
                      </label>
                      <Input
                        value={entry.rfid}
                        onChange={e =>
                          updateEntry(entry.id, 'rfid', e.target.value)
                        }
                        placeholder="Идентификатор RFID"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button appearance="subtle" onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button
            appearance="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Создание...' : `Создать ${entries.length} льготников`}
          </Button>
        </ModalFooter>
      </Modal>

      <ToastContainer>
        {toasts.map((toast, index) => (
          <Toast
            key={toast.key || toast.id}
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
