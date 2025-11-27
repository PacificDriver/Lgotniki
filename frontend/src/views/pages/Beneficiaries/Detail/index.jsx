import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { beneficiariesAPI } from '../../../../services/api'
import { useAuth } from '../../../../services/useAuth'
import Button from '../../../../components/BaseUI/Button'
import Input from '../../../../components/BaseUI/Input'
import Select from '../../../../components/BaseUI/Select'
import AppPage from '../../../../components/CustomUI/AppPage'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'
import { Table, Td, Tr } from '../../../../components/BaseUI/Table'
import { Tabs, TabPanel } from '../../../../components/BaseUI/Tabs'

const statusOptions = [
  { value: 'active', label: 'Активен' },
  { value: 'inactive', label: 'Неактивен' },
  { value: 'archive', label: 'Архив' },
  { value: 'under_review', label: 'На проверке' },
  { value: 'possibly_lost', label: 'Возможно утратил льготу' },
]

export default function BeneficiaryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin, isOperator } = useAuth()
  const [beneficiary, setBeneficiary] = useState(null)
  const [operations, setOperations] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})

  const isNew = id === 'new'

  useEffect(() => {
    if (!isNew) {
      loadData()
    } else {
      setBeneficiary({})
      setEditing(true)
      setLoading(false)
    }
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const [beneficiaryData, operationsData] = await Promise.all([
        beneficiariesAPI.get(id),
        beneficiariesAPI.getOperations(id),
      ])
      setBeneficiary(beneficiaryData)
      setOperations(operationsData)
      setFormData(beneficiaryData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (isNew) {
        await beneficiariesAPI.create(formData)
      } else {
        await beneficiariesAPI.update(id, formData)
      }
      navigate('/dashboard/beneficiaries')
    } catch (error) {
      console.error('Error saving:', error)
      alert('Ошибка при сохранении')
    }
  }

  const breadcrumbs = [
    { label: 'Главная', url: '' },
    { label: 'Реестр льготников', url: '/dashboard/beneficiaries' },
    { label: isNew ? 'Новый льготник' : beneficiary?.fullName || 'Детали' },
  ]

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <AppPage
      title={isNew ? 'Новый льготник' : `Льготник: ${beneficiary?.fullName}`}
      breadcrumbs={breadcrumbs}
      actions={
        editing ? (
          <div className="d-flex gap-2">
            <Button appearance="primary" onClick={handleSave}>
              Сохранить
            </Button>
            <Button
              appearance="subtle"
              onClick={() => {
                if (isNew) {
                  navigate('/dashboard/beneficiaries')
                } else {
                  setEditing(false)
                  setFormData(beneficiary)
                }
              }}
            >
              Отмена
            </Button>
          </div>
        ) : (
          (isAdmin() || isOperator()) && (
            <Button appearance="primary" onClick={() => setEditing(true)}>
              Редактировать
            </Button>
          )
        )
      }
    >
      <Container>
        <ContainerItem sm={4} md={8} xl={12}>
          <Tabs defaultTab="info">
            <TabPanel label="Информация" tabId="info">
              <div className="row gap-3">
                <div className="col-md-6">
                  <Input
                    label="ФИО"
                    value={formData.fullName || ''}
                    onChange={e =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    disabled={!editing}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <Input
                    label="Телефон"
                    value={formData.phone || ''}
                    onChange={e =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={!editing}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email || ''}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!editing}
                  />
                </div>
                <div className="col-md-6">
                  <Input
                    label="Дата рождения"
                    type="date"
                    value={
                      formData.birthDate
                        ? new Date(formData.birthDate)
                            .toISOString()
                            .split('T')[0]
                        : ''
                    }
                    onChange={e =>
                      setFormData({ ...formData, birthDate: e.target.value })
                    }
                    disabled={!editing}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <Input
                    label="СНИЛС"
                    value={formData.snils || ''}
                    onChange={e =>
                      setFormData({ ...formData, snils: e.target.value })
                    }
                    disabled={!editing}
                  />
                </div>
                <div className="col-md-6">
                  <Select
                    label="Статус"
                    value={formData.status || 'active'}
                    onChange={e =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    options={statusOptions}
                    disabled={!editing}
                  />
                </div>
                <div className="col-md-6">
                  <Input
                    label="RFID"
                    value={formData.rfid || ''}
                    onChange={e =>
                      setFormData({ ...formData, rfid: e.target.value })
                    }
                    disabled={!editing}
                  />
                </div>
                <div className="col-md-6">
                  <Input
                    label="NFC ID"
                    value={formData.nfcId || ''}
                    onChange={e =>
                      setFormData({ ...formData, nfcId: e.target.value })
                    }
                    disabled={!editing}
                  />
                </div>
                <div className="col-md-6">
                  <Input
                    label="Hash-PAN"
                    value={formData.hashPan || ''}
                    onChange={e =>
                      setFormData({ ...formData, hashPan: e.target.value })
                    }
                    disabled={!editing}
                  />
                </div>
                <div className="col-md-12">
                  <Input
                    label="Место жительства"
                    value={formData.residence || ''}
                    onChange={e =>
                      setFormData({ ...formData, residence: e.target.value })
                    }
                    disabled={!editing}
                  />
                </div>
              </div>
            </TabPanel>
            <TabPanel label="История операций" tabId="operations">
              <Table
                columns={[
                  { name: 'Дата', dataType: 'text' },
                  { name: 'Тип операции', dataType: 'text' },
                  { name: 'Выполнил', dataType: 'text' },
                ]}
              >
                {operations.map(op => (
                  <Tr key={op.id}>
                    <Td>{new Date(op.created_at).toLocaleString('ru-RU')}</Td>
                    <Td>{op.operation_type}</Td>
                    <Td>{op.performed_by_name}</Td>
                  </Tr>
                ))}
              </Table>
            </TabPanel>
          </Tabs>
        </ContainerItem>
      </Container>
    </AppPage>
  )
}
