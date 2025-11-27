import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useFormatValue } from '../../../../../hooks/useFormatValue'
import { useTheme } from '../../../../../hooks/useTheme'

import Avatar from '../../../../../components/CustomUI/Avatar'
import AvatarGroup from '../../../../../components/BaseUI/AvatarGroup'
import Progress from '../../../../../components/BaseUI/Progress'

import { MdOutlineCalendarMonth } from 'react-icons/md'

import './style.scss'
import Lozenge from '../../../../../components/BaseUI/Lozenge'

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

  return (
    <div className="project-grid-container">
      <div className="project-grid-container__header">
        <Avatar src={data?.image} name="Dropbox" appearance="square" />

        <Lozenge appearance={status[data?.status]}>{data?.status}</Lozenge>
      </div>

      <div className="project-grid-container__content">
        <div
          className="project-grid-container__content--title"
          onClick={() => navigate(`/dashboard/projects/detail/${data?.id}`)}
        >
          {data?.name}
        </div>

        <p className="project-grid-container__content--description">
          {data?.description?.substr(0, 74)}...
        </p>

        <div className="project-grid-container__content--progress">
          <Progress progress={data?.progress} showProgress />
        </div>

        <div className="project-grid-container__content--footer">
          <div>
            <AvatarGroup
              data={data?.users}
              max={4}
              borderColor={theme === 'dark' ? '#8D8DA4' : ''}
            />
          </div>

          <div className="project-grid-container__content--footer--deadline">
            <MdOutlineCalendarMonth /> {format(data?.deadline, 'date')}
          </div>
        </div>
      </div>
    </div>
  )
}
