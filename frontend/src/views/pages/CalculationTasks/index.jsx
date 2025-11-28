import React, { useState, useEffect } from 'react'
import { calculationTasksAPI, benefitTypesAPI } from '../../../services/api'
import { useAuth } from '../../../services/useAuth'
import { translate } from '../../../hooks/translate'
import useDebounce from '../../../hooks/useDebounce'
import Button from '../../../components/BaseUI/Button'
import IconButton from '../../../components/BaseUI/Button/IconButton'
import { Table, Td, Tr } from '../../../components/BaseUI/Table'
import AppPage from '../../../components/CustomUI/AppPage'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'
import SidebarContainer from '../../../components/CustomUI/SidebarContainer'
import Lozenge from '../../../components/BaseUI/Lozenge'
import Input from '../../../components/BaseUI/Input'
import Select from '../../../components/BaseUI/Select'
import { FiPlay, FiEye } from 'react-icons/fi'

const statusOptions = [
  { value: 'pending', label: 'Ожидает' },
  { value: 'in_progress', label: 'Выполняется' },
  { value: 'completed', label: 'Завершена' },
  { value: 'failed', label: 'Ошибка' },
]

export default function CalculationTasks() {
  const { isAdmin, isOperator } = useAuth()
  const [tasks, setTasks] = useState([])
  const [benefitTypes, setBenefitTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [sidebarOpened, setSidebarOpened] = useState(false)
  const [taskDetail, setTaskDetail] = useState(null)

  const headers = [
    { name: 'Название', dataType: 'text' },
    { name: 'Тип льготы', dataType: 'text' },
    { name: 'Статус', dataType: 'text' },
    { name: 'Прогресс', dataType: 'text' },
    { name: 'Создана', dataType: 'date' },
    { name: translate('UI.ACTIONS') },
  ]

  const breadcrumbs = [
    { label: 'Главная', url: '' },
    { label: 'Задачи расчета' },
  ]

  useEffect(() => {
    loadData()
  }, [debouncedSearch])

  const loadData = async () => {
    try {
      setLoading(true)
      const params = {}
      if (debouncedSearch) params.search = debouncedSearch
      const [tasksData, benefitTypesData] = await Promise.all([
        calculationTasksAPI.list(params),
        benefitTypesAPI.list(true),
      ])
      setTasks(tasksData.tasks || [])
      setBenefitTypes(benefitTypesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExecute = async id => {
    try {
      await calculationTasksAPI.execute(id)
      loadData()
    } catch (error) {
      console.error('Error executing task:', error)
    }
  }

  const getStatusLabel = status => {
    const option = statusOptions.find(opt => opt.value === status)
    return option ? option.label : status
  }

  const getStatusAppearance = status => {
    const appearances = {
      pending: 'neutral-subtle',
      in_progress: 'info-subtle',
      completed: 'success-subtle',
      failed: 'danger-subtle',
    }
    return appearances[status] || 'neutral-subtle'
  }

  const getProgress = task => {
    if (!task.totalBeneficiaries) return '0%'
    const percent = Math.round(
      (task.processedBeneficiaries / task.totalBeneficiaries) * 100
    )
    return `${percent}% (${task.processedBeneficiaries}/${task.totalBeneficiaries})`
  }

  return (
    <AppPage
      title="Задачи расчета"
      breadcrumbs={breadcrumbs}
      actions={
        (isAdmin() || isOperator()) && (
          <Button
            appearance="primary"
            onClick={() => {
              setSidebarOpened(true)
              setTaskDetail({})
            }}
          >
            Создать задачу
          </Button>
        )
      }
    >
      <Container>
        <ContainerItem sm={4} md={8} xl={12}>
          <div className="d-flex gap-2 mb-3">
            <Input
              placeholder="Поиск по названию задачи..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>

          <Table
            title="Список задач"
            columns={headers}
            tableId="calculation-tasks-list"
            loading={loading}
            checkboxSelection
            disableColumnMenu
            disableSearchFilter
          >
            {tasks.map(task => {
              // Normalize all values to prevent null/undefined errors in table search
              const normalizeValue = value => {
                if (value === null || value === undefined) return ''
                return String(value)
              }

              const benefitType = benefitTypes.find(
                bt => bt.id === task.benefitTypeId
              )
              return (
                <Tr key={task.id} id={task.id}>
                  <Td>{normalizeValue(task.name)}</Td>
                  <Td>{normalizeValue(benefitType?.name) || '-'}</Td>
                  <Td>
                    <Lozenge appearance={getStatusAppearance(task.status)}>
                      {normalizeValue(getStatusLabel(task.status))}
                    </Lozenge>
                  </Td>
                  <Td>{getProgress(task)}</Td>
                  <Td>
                    {task.createdAt
                      ? new Date(task.createdAt).toLocaleDateString('ru-RU')
                      : '-'}
                  </Td>
                  <Td>
                    <div className="d-flex align-items-center">
                      <IconButton
                        icon={<FiEye style={{ fontSize: '18px' }} />}
                        appearance="subtle"
                        shape="circle"
                        onClick={() => {
                          setSidebarOpened(true)
                          setTaskDetail(task)
                        }}
                      />
                      {(isAdmin() || isOperator()) &&
                        task.status === 'pending' && (
                          <IconButton
                            icon={<FiPlay style={{ fontSize: '18px' }} />}
                            appearance="subtle"
                            shape="circle"
                            onClick={() => handleExecute(task.id)}
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

      <SidebarContainer
        title={taskDetail?.id ? 'Детали задачи' : 'Создать задачу'}
        show={sidebarOpened}
        onClose={() => {
          setSidebarOpened(false)
          setTaskDetail(null)
        }}
      >
        <TaskForm
          task={taskDetail}
          benefitTypes={benefitTypes}
          onSave={async data => {
            try {
              if (taskDetail?.id) {
                // Update not implemented in API yet
              } else {
                await calculationTasksAPI.create(data)
              }
              setSidebarOpened(false)
              loadData()
            } catch (error) {
              console.error('Error saving task:', error)
            }
          }}
        />
      </SidebarContainer>
    </AppPage>
  )
}

function TaskForm({ task, benefitTypes, onSave }) {
  const [formData, setFormData] = useState({
    name: task?.name || '',
    description: task?.description || '',
    benefitTypeId: task?.benefitTypeId || '',
    filters: task?.filters || {},
  })

  const handleSubmit = e => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <Input
          label="Название задачи"
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
          label="Тип льготы"
          value={formData.benefitTypeId}
          onChange={e =>
            setFormData({ ...formData, benefitTypeId: e.target.value })
          }
          options={benefitTypes.map(bt => ({
            value: bt.id,
            label: bt.name,
          }))}
          selected={formData.benefitTypeId ? [formData.benefitTypeId] : []}
          unique={true}
          required
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
