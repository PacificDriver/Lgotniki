import React from 'react'
import { useNavigate } from 'react-router-dom'

import { translate } from '../../../../../hooks/translate'
import { useFormatValue } from '../../../../../hooks/useFormatValue'
import { useTheme } from '../../../../../hooks/useTheme'

import { textTransform } from '../../../../../utils/utils'

import AvatarGroup from '../../../../../components/BaseUI/AvatarGroup'
import Lozenge from '../../../../../components/BaseUI/Lozenge'
import Progress from '../../../../../components/BaseUI/Progress'
import { Table, Td, Tr } from '../../../../../components/BaseUI/Table'
import Avatar from '../../../../../components/CustomUI/Avatar'

import './style.scss'

export default function ProjectGrid({ data }) {
  const format = useFormatValue
  const navigate = useNavigate()
  const theme = useTheme()

  const status = {
    Ongoing: 'warning',
    'Not Started': 'default',
    Delayed: 'danger',
    Completed: 'success',
  }

  const colors = {
    Ongoing: '#F5CD47',
    'Not Started': '#42516D',
    Delayed: '#CA371C',
    Completed: '#32A877',
  }

  const headers = [
    { name: translate('PROJECTS.PROJECT'), dataType: 'text' },
    { name: translate('PROJECTS.MEMBERS'), dataType: 'option' },
    { name: translate('UI.STATUS'), dataType: 'option' },
    { name: translate('UI.PROGRESS'), dataType: 'between' },
    { name: translate('PROJECTS.TASKS'), dataType: 'between' },
    { name: translate('UI.ATTACHMENTS'), dataType: 'between' },
    { name: translate('UI.COMMENTS'), dataType: 'between' },
    { name: translate('PROJECTS.TERM'), dataType: 'option' },
  ]

  return (
    <div className="project-list-container">
      <Table
        columns={headers}
        tableId="project-list"
        checkboxSelection
        disableExport
      >
        {data?.map((project, index) => (
          <Tr key={index} id={project?.id || index}>
            <Td className="d-flex align-items-center gap-1">
              <Avatar src={project?.image} name={project?.name} size="small" />

              <div
                onClick={() =>
                  navigate(`/dashboard/projects/detail/${project?.id}`)
                }
              >
                {project?.name}
              </div>
            </Td>
            <Td>
              <AvatarGroup
                data={project?.users}
                max={4}
                size="small"
                borderColor={theme === 'dark' ? '#BBCCEB' : ''}
              />
            </Td>
            <Td>
              <Lozenge appearance={status[project?.status]}>
                {project?.status}
              </Lozenge>
            </Td>
            <Td>
              <Progress
                progress={project?.progress}
                showProgress
                color={colors[project?.status]}
                height="8px"
              />
            </Td>
            <Td>
              <Lozenge appearance={`${status[project?.status]}-subtle`}>
                {project?.tasks}{' '}
                {textTransform('lowercase', translate('PROJECTS.TASKS'))}
              </Lozenge>
            </Td>
            <Td>
              <Lozenge appearance={`${status[project?.status]}-subtle`}>
                {project?.attachments}{' '}
                {textTransform('lowercase', translate('UI.ATTACHMENTS'))}
              </Lozenge>
            </Td>
            <Td>
              <Lozenge appearance={`${status[project?.status]}-subtle`}>
                {project?.comments}{' '}
                {textTransform('lowercase', translate('UI.COMMENTS'))}
              </Lozenge>
            </Td>
            <Td>{format(project?.deadline, 'date')}</Td>
          </Tr>
        ))}
      </Table>
    </div>
  )
}
