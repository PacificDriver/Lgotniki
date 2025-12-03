import React, { useState, useEffect } from 'react'
import {
  calculationTasksAPI,
  benefitTypesAPI,
  stationsAPI,
} from '../../../services/api'
import { useAuth } from '../../../services/useAuth'
import { translate } from '../../../hooks/translate'
import useDebounce from '../../../hooks/useDebounce'
import Button from '../../../components/BaseUI/Button'
import IconButton from '../../../components/BaseUI/Button/IconButton'
import { Table, Td, ExpandableRow } from '../../../components/BaseUI/Table'
import AppPage from '../../../components/CustomUI/AppPage'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'
import SidebarContainer from '../../../components/CustomUI/SidebarContainer'
import { Toast, ToastContainer } from '../../../components/CustomUI/Toast'
import Lozenge from '../../../components/BaseUI/Lozenge'
import Input from '../../../components/BaseUI/Input'
import Select from '../../../components/BaseUI/Select'
import { FiPlay, FiEye, FiPlus, FiX, FiDownload } from 'react-icons/fi'

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
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [sidebarOpened, setSidebarOpened] = useState(false)
  const [taskDetail, setTaskDetail] = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  const [toasts, setToasts] = useState([])

  const headers = [
    { name: 'Название', dataType: 'text' },
    { name: 'Тип льготы', dataType: 'text' },
    { name: 'Маршрут', dataType: 'text' },
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
      const [tasksData, benefitTypesData, stationsData] = await Promise.all([
        calculationTasksAPI.list(params),
        benefitTypesAPI.list(true),
        stationsAPI.list({ isActive: true }),
      ])
      setTasks(tasksData.tasks || [])
      setBenefitTypes(benefitTypesData)
      setStations(stationsData.stations || stationsData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExecute = async (id, task) => {
    // Show conflict resolution modal
    const conflictResolution = task?.filters?.conflictResolution || 'skip'

    try {
      await calculationTasksAPI.execute(id, { conflictResolution })
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

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const params = {}
      if (debouncedSearch) params.search = debouncedSearch
      const tasksData = await calculationTasksAPI.list(params)
      const rows = tasksData.tasks || []

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
        'Тип льготы',
        'Маршрут',
        'Статус',
        'Прогресс',
        'Создана',
        'Завершена',
      ]

      const csvRows = rows.map(task => {
        const benefitType = benefitTypes.find(
          bt => bt.id === task.benefitTypeId
        )
        return [
          task.name || '',
          task.description || '',
          benefitType?.name || '',
          getRouteInfo(task),
          getStatusLabel(task.status),
          getProgress(task),
          task.createdAt
            ? new Date(task.createdAt).toLocaleDateString('ru-RU')
            : '',
          task.completedAt
            ? new Date(task.completedAt).toLocaleDateString('ru-RU')
            : '',
        ]
      })

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
        `calculation-tasks_${new Date().toISOString().slice(0, 10)}.csv`
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
      console.error('Export calculation tasks error:', error)
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

  const getRouteInfo = task => {
    const filters = task.filters || {}

    // Проверяем новый формат (routePairs)
    const routePairs = filters.routePairs || []

    // Проверяем старый формат для обратной совместимости
    const fromStationId = filters.fromStationId
    const toStationId = filters.toStationId
    const routeDate = filters.routeDate
    const routeNumbers = filters.routeNumbers || []
    const routeNumber = filters.routeNumber

    // Если есть routePairs - используем их
    if (routePairs.length > 0) {
      const routeInfoStrings = routePairs
        .map(pair => {
          const parts = []

          // Названия станций
          if (pair.fromStationId || pair.toStationId) {
            const fromStation = stations.find(s => s.id === pair.fromStationId)
            const toStation = stations.find(s => s.id === pair.toStationId)
            if (fromStation || toStation) {
              parts.push(
                `${fromStation?.name || '?'} → ${toStation?.name || '?'}`
              )
            }
          }

          // Дата
          if (pair.routeDate) {
            try {
              const date = new Date(pair.routeDate)
              const formattedDate = date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
              parts.push(formattedDate)
            } catch (e) {
              parts.push(pair.routeDate)
            }
          }

          // Номера маршрутов
          if (pair.routeNumbers && pair.routeNumbers.length > 0) {
            parts.push(`№${pair.routeNumbers.join(', №')}`)
          }

          return parts.length > 0 ? parts.join(', ') : null
        })
        .filter(Boolean)

      return routeInfoStrings.length > 0 ? routeInfoStrings.join('; ') : '-'
    }

    // Старый формат для обратной совместимости
    if (
      !fromStationId &&
      !toStationId &&
      !routeDate &&
      routeNumbers.length === 0 &&
      !routeNumber
    ) {
      return '-'
    }

    const parts = []

    // Названия станций
    if (fromStationId || toStationId) {
      const fromStation = stations.find(s => s.id === fromStationId)
      const toStation = stations.find(s => s.id === toStationId)
      if (fromStation || toStation) {
        parts.push(`${fromStation?.name || '?'} → ${toStation?.name || '?'}`)
      }
    }

    // Дата
    if (routeDate) {
      try {
        const date = new Date(routeDate)
        const formattedDate = date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        parts.push(formattedDate)
      } catch (e) {
        parts.push(routeDate)
      }
    }

    // Номера маршрутов
    if (routeNumbers && routeNumbers.length > 0) {
      parts.push(`№${routeNumbers.join(', №')}`)
    } else if (routeNumber) {
      parts.push(`№${routeNumber}`)
    }

    return parts.length > 0 ? parts.join(', ') : '-'
  }

  const renderTaskDetails = task => {
    const filters = task.filters || {}
    const benefitType = benefitTypes.find(bt => bt.id === task.benefitTypeId)

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
        {task.description && (
          <div>
            <strong>Описание:</strong>
            <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
              {task.description}
            </p>
          </div>
        )}

        <div>
          <strong>Тип льготы:</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
            {benefitType?.name || '-'}
          </p>
        </div>

        {task.errorMessage && (
          <div>
            <strong>Ошибка:</strong>
            <p
              style={{
                margin: '4px 0 0',
                color: 'var(--m-danger)',
                wordBreak: 'break-word',
              }}
            >
              {task.errorMessage}
            </p>
          </div>
        )}

        <div>
          <strong>Общее количество льготников:</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
            {task.totalBeneficiaries || 0}
          </p>
        </div>

        <div>
          <strong>Обработано:</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
            {task.processedBeneficiaries || 0}
          </p>
        </div>

        {filters.ageMin || filters.ageMax ? (
          <div>
            <strong>Возраст:</strong>
            <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
              {filters.ageMin && filters.ageMax
                ? `${filters.ageMin} - ${filters.ageMax} лет`
                : filters.ageMin
                  ? `От ${filters.ageMin} лет`
                  : `До ${filters.ageMax} лет`}
            </p>
          </div>
        ) : null}

        {filters.residence && (
          <div>
            <strong>Место жительства:</strong>
            <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
              {filters.residence}
            </p>
          </div>
        )}

        {filters.currentBenefitTypeId && (
          <div>
            <strong>Текущий тип льготы:</strong>
            <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
              {benefitTypes.find(bt => bt.id === filters.currentBenefitTypeId)
                ?.name || filters.currentBenefitTypeId}
            </p>
          </div>
        )}

        {filters.status && (
          <div>
            <strong>Статус льготника:</strong>
            <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
              {filters.status}
            </p>
          </div>
        )}

        {(filters.routePairs?.length > 0 ||
          filters.routeNumbers ||
          filters.routeNumber ||
          filters.fromStationId ||
          filters.toStationId ||
          filters.routeDate) && (
          <div>
            <strong>
              Маршрут{(filters.routePairs || []).length > 1 ? 'ы' : ''}:
            </strong>
            <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
              {getRouteInfo(task)}
            </p>
          </div>
        )}

        <div>
          <strong>Создана:</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
            {formatDate(task.createdAt)}
          </p>
        </div>

        {task.completedAt && (
          <div>
            <strong>Завершена:</strong>
            <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
              {formatDate(task.completedAt)}
            </p>
          </div>
        )}

        <div>
          <strong>Обновлена:</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--m-text-light)' }}>
            {formatDate(task.updatedAt)}
          </p>
        </div>
      </div>
    )
  }

  const removeToast = index => {
    const values = toasts
    values.splice(index, 1)
    setToasts([...values])
  }

  return (
    <>
      <AppPage
        title="Задачи расчета"
        breadcrumbs={breadcrumbs}
        actions={
          (isAdmin() || isOperator()) && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button
                appearance="primary"
                onClick={() => {
                  setSidebarOpened(true)
                  setTaskDetail({})
                }}
              >
                Создать задачу
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
              disableExport
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
                  <ExpandableRow
                    key={task.id}
                    id={task.id}
                    expandableContent={renderTaskDetails(task)}
                  >
                    <Td>{normalizeValue(task.name)}</Td>
                    <Td>{normalizeValue(benefitType?.name) || '-'}</Td>
                    <Td>{getRouteInfo(task)}</Td>
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
                              onClick={() => handleExecute(task.id, task)}
                            />
                          )}
                      </div>
                    </Td>
                  </ExpandableRow>
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
                  // Save conflict resolution in filters
                  const taskData = {
                    ...data,
                    filters: {
                      ...data.filters,
                      conflictResolution: data.conflictResolution,
                    },
                  }
                  await calculationTasksAPI.create(taskData)
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
      <ToastContainer>
        {toasts.map((toast, index) => (
          <Toast
            key={toast.key || toast.id || index}
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

function TaskForm({ task, benefitTypes, onSave }) {
  // Инициализируем filters с конвертацией старой структуры в новую (массив пар станций)
  const initializeFilters = filters => {
    if (!filters) return {}
    const result = { ...filters }

    // Конвертируем старый routeNumber в массив routeNumbers для обратной совместимости
    if (result.routeNumber && !result.routeNumbers) {
      result.routeNumbers = [result.routeNumber]
      delete result.routeNumber
    }
    // Убеждаемся, что routeNumbers - это массив
    if (result.routeNumbers && !Array.isArray(result.routeNumbers)) {
      result.routeNumbers = [result.routeNumbers]
    }

    // Конвертируем старую структуру (fromStationId, toStationId, routeDate) в routePairs
    if (
      !result.routePairs &&
      (result.fromStationId || result.toStationId || result.routeDate)
    ) {
      result.routePairs = [
        {
          fromStationId: result.fromStationId,
          toStationId: result.toStationId,
          routeDate: result.routeDate,
          routeNumbers: result.routeNumbers || [],
        },
      ]
      // Можно оставить старые поля для обратной совместимости или удалить их
    } else if (!result.routePairs) {
      // Если нет ни старых, ни новых данных - создаем пустой массив
      result.routePairs = []
    }
    // Убеждаемся, что routePairs - это массив
    if (result.routePairs && !Array.isArray(result.routePairs)) {
      result.routePairs = [result.routePairs]
    }

    return result
  }

  const [formData, setFormData] = useState({
    name: task?.name || '',
    description: task?.description || '',
    benefitTypeId: task?.benefitTypeId || '',
    filters: initializeFilters(task?.filters),
    conflictResolution: task?.filters?.conflictResolution || 'skip',
  })
  const [stations, setStations] = useState([])
  const [loadingStations, setLoadingStations] = useState(false)
  const [routeInfos, setRouteInfos] = useState({}) // Храним информацию о маршрутах для каждой пары
  const [routeErrors, setRouteErrors] = useState({}) // Храним ошибки для каждой пары
  const [checkingRoutes, setCheckingRoutes] = useState({}) // Флаг проверки для каждой пары
  const [availableRouteNumbers, setAvailableRouteNumbers] = useState({}) // Доступные маршруты для каждой пары

  // Инициализируем routePairs если их нет
  useEffect(() => {
    if (
      !formData.filters.routePairs ||
      formData.filters.routePairs.length === 0
    ) {
      setFormData(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          routePairs: [
            {
              id: Date.now(),
              fromStationId: '',
              toStationId: '',
              routeDate: '',
              routeNumbers: [],
            },
          ],
        },
      }))
    } else {
      // Убеждаемся, что у каждой пары есть id
      setFormData(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          routePairs: prev.filters.routePairs.map((pair, index) => ({
            ...pair,
            id: pair.id || Date.now() + index,
          })),
        },
      }))
    }
  }, [])

  useEffect(() => {
    loadStations()
  }, [])

  const loadStations = async () => {
    try {
      setLoadingStations(true)
      const data = await stationsAPI.list({ isActive: true })
      setStations(data.stations || data || [])
    } catch (error) {
      console.error('Error loading stations:', error)
    } finally {
      setLoadingStations(false)
    }
  }

  // Функция для проверки маршрута для одной пары станций
  const checkRouteForPair = async pairId => {
    const pair = (formData.filters.routePairs || []).find(p => p.id === pairId)
    if (
      !pair ||
      !pair.fromStationId ||
      !pair.toStationId ||
      !pair.routeDate ||
      stations.length === 0
    ) {
      return
    }

    try {
      setCheckingRoutes(prev => ({ ...prev, [pairId]: true }))
      setRouteErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[pairId]
        return newErrors
      })

      // Находим станции для получения external_id
      const fromStation = stations.find(s => s.id === pair.fromStationId)
      const toStation = stations.find(s => s.id === pair.toStationId)

      if (!fromStation?.externalId || !toStation?.externalId) {
        setRouteErrors(prev => ({
          ...prev,
          [pairId]: 'Не удалось найти ID станций',
        }))
        return
      }

      // Форматируем дату в формат API (DD.MM.YY)
      const date = new Date(pair.routeDate)
      const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getFullYear()).slice(-2)}`

      const races = await stationsAPI.getRaces(
        fromStation.externalId,
        toStation.externalId,
        formattedDate
      )

      if (races && races.length > 0) {
        // Извлекаем номера маршрутов из рейсов
        const routeNumbers = races
          .map(race => race.route || race.route_number || race.routeNumber)
          .filter((r, i, arr) => r && arr.indexOf(r) === i)

        if (routeNumbers.length > 0) {
          setAvailableRouteNumbers(prev => ({
            ...prev,
            [pairId]: routeNumbers,
          }))
          setRouteInfos(prev => ({
            ...prev,
            [pairId]: {
              found: true,
              count: races.length,
              routeNumbers: routeNumbers,
              message: `Найдено ${races.length} рейс(ов), доступно ${routeNumbers.length} номер(ов) маршрута`,
            },
          }))
        } else {
          setAvailableRouteNumbers(prev => ({
            ...prev,
            [pairId]: [],
          }))
          setRouteInfos(prev => ({
            ...prev,
            [pairId]: {
              found: false,
              count: races.length,
              message: `Найдено ${races.length} рейс(ов), но номер маршрута не указан`,
            },
          }))
        }
      } else {
        setAvailableRouteNumbers(prev => ({
          ...prev,
          [pairId]: [],
        }))
        setRouteInfos(prev => ({
          ...prev,
          [pairId]: {
            found: false,
            count: 0,
            message: 'Рейсов не найдено для выбранных станций и даты',
          },
        }))
      }
    } catch (error) {
      console.error('Error checking route:', error)
      setRouteErrors(prev => ({
        ...prev,
        [pairId]: error.response?.data?.error || 'Ошибка при проверке маршрута',
      }))
      setRouteInfos(prev => {
        const newInfos = { ...prev }
        delete newInfos[pairId]
        return newInfos
      })
    } finally {
      setCheckingRoutes(prev => {
        const newChecking = { ...prev }
        delete newChecking[pairId]
        return newChecking
      })
    }
  }

  // Проверяем маршруты для всех пар при изменении
  useEffect(() => {
    const routePairs = formData.filters.routePairs || []
    if (routePairs.length === 0 || stations.length === 0) return

    const timers = {}

    routePairs.forEach(pair => {
      if (!pair.id) return

      // Создаем таймер для каждой пары
      timers[pair.id] = setTimeout(() => {
        checkRouteForPair(pair.id)
      }, 500)
    })

    return () => {
      Object.values(timers).forEach(timer => clearTimeout(timer))
    }
  }, [formData.filters.routePairs, stations])

  const statusOptions = [
    { value: 'active', label: 'Активен' },
    { value: 'inactive', label: 'Неактивен' },
    { value: 'archive', label: 'Архив' },
    { value: 'under_review', label: 'На проверке' },
  ]

  const conflictResolutionOptions = [
    { value: 'skip', label: 'Пропустить (оставить текущую)' },
    { value: 'replace', label: 'Заменить (деактивировать текущую)' },
    { value: 'add_secondary', label: 'Добавить вторую льготу' },
  ]

  const handleFilterChange = (key, value) => {
    setFormData({
      ...formData,
      filters: {
        ...formData.filters,
        [key]: value || undefined,
      },
    })
  }

  // Добавить новую пару станций
  const addRoutePair = () => {
    setFormData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        routePairs: [
          ...(prev.filters.routePairs || []),
          {
            id: Date.now(),
            fromStationId: '',
            toStationId: '',
            routeDate: '',
            routeNumbers: [],
          },
        ],
      },
    }))
  }

  // Удалить пару станций
  const removeRoutePair = pairId => {
    setFormData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        routePairs: (prev.filters.routePairs || []).filter(
          p => p.id !== pairId
        ),
      },
    }))
    // Удаляем информацию о маршрутах для этой пары
    setRouteInfos(prev => {
      const newInfos = { ...prev }
      delete newInfos[pairId]
      return newInfos
    })
    setRouteErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[pairId]
      return newErrors
    })
  }

  // Обновить пару станций
  const updateRoutePair = (pairId, field, value) => {
    setFormData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        routePairs: (prev.filters.routePairs || []).map(pair =>
          pair.id === pairId ? { ...pair, [field]: value } : pair
        ),
      },
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    // Clean up empty filters - remove empty strings, undefined, null values
    const cleanedFilters = Object.fromEntries(
      Object.entries(formData.filters).filter(([, v]) => {
        // Keep valid values
        if (v === 0 || v === false) return true // Keep zero and false
        if (v === '' || v === undefined || v === null) return false
        if (Array.isArray(v) && v.length === 0) return false
        if (typeof v === 'object' && Object.keys(v).length === 0) return false
        return true
      })
    )
    // Ensure benefitTypeId is valid (not empty string)
    if (!formData.benefitTypeId || formData.benefitTypeId === '') {
      alert('Пожалуйста, выберите тип льготы')
      return
    }
    onSave({ ...formData, filters: cleanedFilters })
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
          label="Тип льготы для назначения"
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

      <h4 style={{ marginTop: '24px', marginBottom: '16px', fontSize: '16px' }}>
        Фильтры выборки льготников
      </h4>

      <div className="mb-3">
        <Select
          label="Статус льготника"
          value={formData.filters.status || ''}
          onChange={e => handleFilterChange('status', e.target.value)}
          options={statusOptions}
          selected={formData.filters.status ? [formData.filters.status] : []}
          unique={true}
        />
      </div>

      <div className="mb-3">
        <label
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '8px',
          }}
        >
          Возраст (лет)
        </label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Input
            placeholder="От"
            type="number"
            value={formData.filters.ageFrom || ''}
            onChange={e =>
              handleFilterChange('ageFrom', parseInt(e.target.value) || '')
            }
          />
          <Input
            placeholder="До"
            type="number"
            value={formData.filters.ageTo || ''}
            onChange={e =>
              handleFilterChange('ageTo', parseInt(e.target.value) || '')
            }
          />
        </div>
      </div>

      <div className="mb-3">
        <label
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '8px',
          }}
        >
          Дата рождения
        </label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Input
            placeholder="Месяц (1-12)"
            type="number"
            min="1"
            max="12"
            value={formData.filters.birthMonth || ''}
            onChange={e =>
              handleFilterChange('birthMonth', parseInt(e.target.value) || '')
            }
          />
          <Input
            placeholder="День (1-31)"
            type="number"
            min="1"
            max="31"
            value={formData.filters.birthDay || ''}
            onChange={e =>
              handleFilterChange('birthDay', parseInt(e.target.value) || '')
            }
          />
        </div>
      </div>

      <div className="mb-3">
        <Input
          label="Место жительства (населенный пункт)"
          value={formData.filters.residence || ''}
          onChange={e => handleFilterChange('residence', e.target.value)}
          placeholder="Например: Москва"
        />
      </div>

      <h4 style={{ marginTop: '24px', marginBottom: '16px', fontSize: '16px' }}>
        Маршруты
      </h4>

      {(formData.filters.routePairs || []).map((pair, index) => (
        <div
          key={pair.id}
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '16px',
            backgroundColor: '#fafafa',
            position: 'relative',
          }}
        >
          {(formData.filters.routePairs || []).length > 1 && (
            <Button
              appearance="subtle"
              iconBefore={<FiX />}
              onClick={() => removeRoutePair(pair.id)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
              }}
            >
              Удалить
            </Button>
          )}

          <h5 style={{ marginTop: 0, marginBottom: '16px', fontSize: '14px' }}>
            Маршрут {index + 1}
          </h5>

          <div className="mb-3">
            <Select
              label="Станция отправления"
              value={pair.fromStationId || ''}
              onChange={e =>
                updateRoutePair(pair.id, 'fromStationId', e.target.value)
              }
              options={stations.map(s => ({
                value: s.id,
                label: s.name,
              }))}
              selected={pair.fromStationId ? [pair.fromStationId] : []}
              unique={true}
              isLoading={loadingStations}
            />
          </div>

          <div className="mb-3">
            <Select
              label="Станция назначения"
              value={pair.toStationId || ''}
              onChange={e =>
                updateRoutePair(pair.id, 'toStationId', e.target.value)
              }
              options={stations.map(s => ({
                value: s.id,
                label: s.name,
              }))}
              selected={pair.toStationId ? [pair.toStationId] : []}
              unique={true}
              isLoading={loadingStations}
            />
          </div>

          <div className="mb-3">
            <Input
              label="Дата рейса"
              type="date"
              value={pair.routeDate || ''}
              onChange={e =>
                updateRoutePair(pair.id, 'routeDate', e.target.value)
              }
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {checkingRoutes[pair.id] && (
            <div className="mb-3" style={{ color: '#666', fontSize: '14px' }}>
              Проверка маршрута...
            </div>
          )}

          {routeInfos[pair.id] && (
            <div
              className="mb-3"
              style={{
                padding: '12px',
                borderRadius: '4px',
                backgroundColor: routeInfos[pair.id].found
                  ? '#e8f5e9'
                  : '#fff3e0',
                color: routeInfos[pair.id].found ? '#2e7d32' : '#e65100',
                fontSize: '14px',
              }}
            >
              {routeInfos[pair.id].message}
            </div>
          )}

          {routeErrors[pair.id] && (
            <div
              className="mb-3"
              style={{
                padding: '12px',
                borderRadius: '4px',
                backgroundColor: '#ffebee',
                color: '#c62828',
                fontSize: '14px',
              }}
            >
              {routeErrors[pair.id]}
            </div>
          )}

          {routeInfos[pair.id] &&
            routeInfos[pair.id].found &&
            availableRouteNumbers[pair.id] &&
            availableRouteNumbers[pair.id].length > 0 && (
              <div className="mb-3">
                <Select
                  label="Выберите маршруты"
                  value={pair.routeNumbers || []}
                  onChange={e => {
                    const selectedValues = Array.isArray(e.target.value)
                      ? e.target.value
                      : e.target.value
                        ? [e.target.value]
                        : []
                    updateRoutePair(pair.id, 'routeNumbers', selectedValues)
                  }}
                  options={availableRouteNumbers[pair.id].map(rn => ({
                    value: rn,
                    label: `Маршрут №${rn}`,
                  }))}
                  selected={pair.routeNumbers || []}
                  unique={false}
                />
                <div
                  style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}
                >
                  Можно выбрать несколько маршрутов
                </div>
              </div>
            )}

          {(!routeInfos[pair.id] || !routeInfos[pair.id].found) && (
            <div className="mb-3">
              <Input
                label="Номер маршрута (если не найден автоматически)"
                value={
                  Array.isArray(pair.routeNumbers)
                    ? pair.routeNumbers.join(', ')
                    : ''
                }
                onChange={e => {
                  const value = e.target.value
                  // Если введено несколько номеров через запятую, разбиваем на массив
                  const routeNumbers = value
                    ? value
                        .split(',')
                        .map(r => r.trim())
                        .filter(r => r)
                    : []
                  updateRoutePair(pair.id, 'routeNumbers', routeNumbers)
                }}
                placeholder="Введите номер(а) маршрута через запятую"
              />
            </div>
          )}
        </div>
      ))}

      <div className="mb-3">
        <Button
          appearance="primary"
          iconBefore={<FiPlus />}
          onClick={addRoutePair}
        >
          Добавить маршрут
        </Button>
      </div>

      <div className="mb-3">
        <Input
          label="Поиск по ФИО, телефону, email"
          value={formData.filters.search || ''}
          onChange={e => handleFilterChange('search', e.target.value)}
          placeholder="Введите текст для поиска"
        />
      </div>

      <h4 style={{ marginTop: '24px', marginBottom: '16px', fontSize: '16px' }}>
        Обработка конфликтов
      </h4>

      <div className="mb-3">
        <Select
          label="Если у льготника уже есть активная льгота"
          value={formData.conflictResolution}
          onChange={e =>
            setFormData({ ...formData, conflictResolution: e.target.value })
          }
          options={conflictResolutionOptions}
          selected={[formData.conflictResolution]}
          unique={true}
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
