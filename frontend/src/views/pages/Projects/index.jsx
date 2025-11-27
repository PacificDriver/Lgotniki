import React, { useEffect, useState } from 'react'

import { translate } from '../../../hooks/translate'
import { getAllUsers } from '../../../services/users'

import Lozenge from '../../../components/BaseUI/Lozenge'
import { Table, Td, Tr } from '../../../components/BaseUI/Table'
import AppPage from '../../../components/CustomUI/AppPage'
import CardInfo from '../../../components/CustomUI/CardInfo'
import ApexChart from '../../../components/CustomUI/Charts/ApexChart'
import Container from '../../../components/CustomUI/Container'
import ContainerItem from '../../../components/CustomUI/Container/ContainerItem'

import {
  MdHistoryToggleOff,
  MdMoreTime,
  MdOutlineCases,
  MdOutlineCheckCircleOutline,
} from 'react-icons/md'

import boardsJSON from '../../../mocks/boards'
import { useRequire } from '../../../utils/utils'
import DataStatusCard from '../../../widgets/DataStatusCard'
import ProgressIndicator from '../../../widgets/ProgressIndicator'

const Projects = () => {
  const breadcrumbs = [{ label: 'Magnun', url: '' }, { label: 'Projects' }]

  const projectCards = [
    {
      title: translate('PROJECTS.ACTIVE_PROJECTS'),
      type: 'number',
      value: 9,
      icon: <MdOutlineCases />,
    },
    {
      title: translate('PROJECTS.COMPLETED_PROJECTS'),
      type: 'number',
      value: 4,
      icon: <MdOutlineCheckCircleOutline />,
      appearance: 'success',
    },
    {
      title: translate('PROJECTS.PROJECTS_IN_PROGRESS'),
      type: 'number',
      value: 2,
      icon: <MdHistoryToggleOff />,
      appearance: 'warning',
    },
    {
      title: translate('PROJECTS.DELAYED_PROJECTS'),
      type: 'number',
      value: 3,
      icon: <MdMoreTime />,
      appearance: 'danger',
    },
  ]

  const headers = [
    { name: translate('UI.NAME'), dataType: 'text', width: 500 },
    { name: translate('UI.STATUS'), dataType: 'option' },
    { name: translate('DASHBOARD.ASSIGNED_TO'), dataType: 'date', width: 200 },
    { name: translate('DASHBOARD.TIME_SPENT'), dataType: 'between' },
  ]

  const tasks = [
    {
      name: 'Implement recurring payment module',
      status: 'error',
      responsible: 'Max Smith',
      timeSpent: '168h 16min',
    },
    {
      name: 'Create new login interface',
      status: 'success',
      responsible: 'Anthony B. Hopkins',
      timeSpent: '48h 0min',
    },
    {
      name: 'Plan functionality for extracting reports',
      status: 'pending',
      responsible: 'Katrina Stambook',
      timeSpent: '78h 27min',
    },
    {
      name: 'Add multilingual on the platform',
      status: 'success',
      responsible: 'Samantha Smith',
      timeSpent: '56h 21min',
    },
    {
      name: 'Implement anonymization process in homologation bases',
      status: 'pending',
      responsible: 'Samantha Smith',
      timeSpent: '56h 21min',
    },
  ]

  const statusOptions = {
    error: {
      name: translate('UI.OUTDATED'),
      class: 'danger-subtle',
    },
    pending: {
      name: translate('UI.IN_PROGRESS'),
      class: 'warning-subtle',
    },
    success: {
      name: translate('UI.COMPLETEDS'),
      class: 'success-subtle',
    },
  }

  const developmentHistory = {
    options: {
      xaxis: {
        categories: [
          'Sprint 1',
          'Sprint 2',
          'Sprint 3',
          'Sprint 4',
          'Sprint 5',
          'Sprint 6',
          'Sprint 7',
          'Sprint 8',
          'Sprint 9',
          'Sprint 10',
          'Sprint 11',
          'Sprint 12',
        ],
        tooltip: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: 'Commits',
        data: [60, 70, 55, 80, 40, 65, 70, 90, 50, 85, 45, 60],
      },
      {
        name: 'Pull Requests',
        data: [15, 25, 30, 10, 20, 35, 25, 40, 30, 15, 35, 40],
      },
      {
        name: 'Deploys',
        data: [25, 10, 35, 20, 30, 15, 30, 20, 35, 25, 40, 30],
      },
    ],
  }

  const [boards] = useState(boardsJSON)
  const [users, setUsers] = useState([])
  const [, setProjects] = useState({})

  const projectImages = [
    useRequire('extras/javascript.png'),
    useRequire('extras/git.png'),
    useRequire('extras/python.png'),
    useRequire('extras/css-3.png'),
    useRequire('extras/golang.png'),
    useRequire('extras/html.png'),
  ]

  const progressBarColors = [
    '#8c62ff',
    '#0caf60',
    '#0062ff',
    '#fcb900',
    '#ff3d74',
    '#FF4500',
  ]

  useEffect(() => {
    const loadBoards = async () => {
      const combinedItems = [
        ...(boards[0]?.items || []),
        ...(boards[1]?.items || []),
        ...(boards[2]?.items || []),
      ]

      const categories = combinedItems.map((item, index) => ({
        name: item?.title,
        image: projectImages[index],
        color: progressBarColors[index],
      }))

      const dataset = combinedItems.map(item =>
        ((item?.completedTasks / item?.totalTasks) * 100).toFixed(2)
      )

      setProjects({ categories, dataset })
    }

    const loadUsers = async () => {
      const users = await getAllUsers()

      setUsers(users)
    }

    loadBoards()
    loadUsers()
  }, [])

  return (
    <AppPage title="Projects Dashboard" breadcrumbs={breadcrumbs}>
      <Container>
        <ContainerItem sm={4} md={4} xl={12}>
          <Container>
            {projectCards?.map((card, index) => (
              <ContainerItem key={index} sm={4} md={4} xl={3}>
                <CardInfo card={card} appearance={card.appearance} />
              </ContainerItem>
            ))}
          </Container>
        </ContainerItem>
      </Container>

      <Container className="mt-3">
        <ContainerItem sm={4} md={8} xl={5}>
          <Container>
            <ContainerItem sm={4} md={4} xl={12}>
              <DataStatusCard
                title={translate('DASHBOARD.PROJECT_STATUS_OVERVIEW')}
                subtitles={{
                  labels: [
                    translate('DASHBOARD.TOTAL_PROJECTS'),
                    translate('DASHBOARD.TOTAL_BUDGET'),
                  ],
                  values: [
                    { value: 35, typeOfInformation: 'number', precision: 0 },
                    {
                      value: 236938.24,
                      typeOfInformation: 'money',
                      precision: 2,
                    },
                  ],
                }}
                dataset={{
                  categories: [
                    translate('UI.IN_PROGRESS'),
                    translate('UI.LATE'),
                    translate('UI.COMPLETED'),
                  ],
                  values: [18, 5, 12],
                  colors: ['#0EC66D', '#fcb900', '#ff3d74'],
                }}
              />
            </ContainerItem>

            <ContainerItem sm={4} md={4} xl={12}>
              <ProgressIndicator
                title={translate('DASHBOARD.TASK_COMPLETETION_RATE')}
                description={translate(
                  'DASHBOARD.TASK_COMPLETETION_RATE_LARGE_MSG'
                )}
                currentValue={92}
                previousValue={84}
                color="#43b79a"
                users={users}
                userLimit={6}
              />
            </ContainerItem>
          </Container>
        </ContainerItem>

        <ContainerItem sm={4} md={8} xl={7}>
          <ApexChart
            title={translate('DASHBOARD.DEVELOPMENT_HISTORY')}
            type={'barStacked'}
            options={developmentHistory.options}
            categories={developmentHistory.options?.xaxis?.categories}
            series={developmentHistory.series}
            legend={false}
            height={350}
            colors={['#005FED', '#F5CD47', '#32A877']}
          />
        </ContainerItem>
      </Container>

      <Container className="my-3">
        <ContainerItem sm={4} md={8} xl={12}>
          <Table
            title={translate('DASHBOARD.RECENT_ACTIVITIES')}
            columns={headers}
            tableId="projects-tasks"
            disableColumnMenu
            disableColumnFilter
            disableColumnResize
            disableColumnSorting
            disableExport
            disableSearchFilter
            hideFooter
          >
            {tasks.map((item, index) => (
              <Tr key={index} id={item?.id || index}>
                <Td>{item.name}</Td>
                <Td className="d-flex gap-1">
                  <Lozenge appearance={statusOptions[item.status].class}>
                    {statusOptions[item.status].name}
                  </Lozenge>
                </Td>
                <Td>{item.responsible}</Td>
                <Td>
                  <Lozenge appearance="info-subtle">{item.timeSpent}</Lozenge>
                </Td>
              </Tr>
            ))}
          </Table>
        </ContainerItem>
      </Container>
    </AppPage>
  )
}

export default Projects
