import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { translate } from '../../../../hooks/translate'
import { useTheme } from '../../../../hooks/useTheme'

import AppPage from '../../../../components/CustomUI/AppPage'
import Button from '../../../../components/BaseUI/Button'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'
import CardContainer from '../../../../components/CustomUI/CardContainer'
import ButtonGroup from '../../../../components/BaseUI/ButtonGroup'
import ProjectGrid from './ProjectGrid'
import ProjectList from './ProjectList'

import slack from '../../../../assets/brands/slack.png'
import dropbox from '../../../../assets/brands/dropbox.png'
import bitbucket from '../../../../assets/brands/bitbucket.jpg'
import mailchimp from '../../../../assets/brands/mailchimp.jpg'

import { RiListCheck2 } from 'react-icons/ri'
import { MdGridView } from 'react-icons/md'

export default function ProjectsList() {
  const breadcrumbs = [
    { label: 'Magnun', url: '' },
    { label: 'Projects', url: '' },
    { label: translate('Lista de Projetos') },
  ]

  const projects = [
    {
      id: '2fd4e1c67a2d28fced849ee1bb76e7391b93eb12',
      name: 'Marketing Campaign: Spring Season',
      description:
        'This project involves planning and executing a marketing campaign for the Spring season. It includes creating promotional materials, social media strategies, and advertising campaigns.',
      users: [
        { name: 'Alice Johnson', image: '' },
        { name: 'Mark Smith', image: '' },
        { name: 'Olivia Davis', image: '' },
      ],
      status: 'Ongoing',
      tasks: 30,
      comments: 6,
      deadline: '2024-04-30',
      progress: 60,
      attachments: 12,
      image: slack,
    },
    {
      id: 'de9f2c7fd25e1b3afad3e85a0bd17d9b100db4b3',
      name: 'Mobile App Development: Fitness Tracker',
      description:
        'This project involves developing a mobile application for tracking fitness activities. It includes features such as workout logging, calorie tracking, and progress visualization.',
      users: [
        { name: 'Jack Wilson', image: '' },
        { name: 'Sophie Brown', image: '' },
        { name: 'Ethan Miller', image: '' },
        { name: 'Mark Smith', image: '' },
        { name: 'Olivia Davis', image: '' },
      ],
      status: 'Not Started',
      tasks: 25,
      comments: 10,
      deadline: '2024-05-15',
      progress: 0,
      attachments: 8,
      image: dropbox,
    },
    {
      id: 'a3b69a54e5c4c87f3eb035bf2419723c8d9f8efb',
      name: 'E-commerce Website Redesign',
      description:
        'This project involves redesigning the e-commerce website to improve user experience and increase conversion rates. It includes revamping the layout, optimizing performance, and implementing new features.',
      users: [
        { name: 'Emma Garcia', image: '' },
        { name: 'William Martinez', image: '' },
        { name: 'Liam Johnson', image: '' },
        { name: 'Sophie Brown', image: '' },
      ],
      status: 'Delayed',
      tasks: 40,
      comments: 8,
      deadline: '2024-06-30',
      progress: 30,
      attachments: 15,
      image: mailchimp,
    },
    {
      id: 'effcdf6ae5eb2fa2d27416d5f184df9c259a7c79',
      name: 'Product Inventory Management System',
      description:
        'This project involves developing a new system for managing product inventory. It includes features such as inventory tracking, stock alerts, and reporting.',
      users: [
        { name: 'Sophia Clark', image: '' },
        { name: 'Daniel Taylor', image: '' },
        { name: 'Mia Brown', image: '' },
        { name: 'Emma Garcia', image: '' },
      ],
      status: 'Completed',
      tasks: 20,
      comments: 4,
      deadline: '2024-04-15',
      progress: 100,
      attachments: 5,
      image: bitbucket,
    },
    {
      id: 'eccbc87e4b5ce2fe28308fd9f2a7baf3',
      name: 'Financial Reporting Automation',
      description:
        'This project involves automating financial reporting processes to increase efficiency and accuracy. It includes developing custom software solutions and integrating with existing systems.',
      users: [
        { name: 'Noah Rodriguez', image: '' },
        { name: 'Ava Wilson', image: '' },
        { name: 'James Anderson', image: '' },
      ],
      status: 'Ongoing',
      tasks: 35,
      comments: 12,
      deadline: '2024-07-31',
      progress: 50,
      attachments: 10,
      image: dropbox,
    },
    {
      id: '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8',
      name: 'Company-wide Training Program',
      description:
        'This project involves designing and implementing a comprehensive training program for employees. It includes identifying training needs, developing materials, and delivering sessions.',
      users: [
        { name: 'Chloe Garcia', image: '' },
        { name: 'Logan Martinez', image: '' },
        { name: 'Ella Johnson', image: '' },
        { name: 'James Anderson', image: '' },
        { name: 'Benjamin Brown', image: '' },
        { name: 'Grace Taylor', image: '' },
      ],
      status: 'Not Started',
      tasks: 15,
      comments: 3,
      deadline: '2024-09-15',
      progress: 0,
      attachments: 5,
      image: slack,
    },
    {
      id: '5756e10cd6d251fcd88c4a8e94df8b0a38894f4d',
      name: 'Cloud Migration Project',
      description:
        'This project involves migrating on-premises IT infrastructure to cloud-based solutions. It includes planning, executing, and testing the migration process to ensure seamless transition.',
      users: [
        { name: 'Benjamin Brown', image: '' },
        { name: 'Grace Taylor', image: '' },
        { name: 'Lucas Wilson', image: '' },
      ],
      status: 'Ongoing',
      tasks: 50,
      comments: 7,
      deadline: '2024-08-30',
      progress: 70,
      attachments: 20,
      image: mailchimp,
    },
  ]

  const [gridView, setGridView] = useState(true)

  const navigate = useNavigate()
  const theme = useTheme()

  return (
    <AppPage
      title={translate('PROJECTS.LIST_OF_PROJECTS')}
      breadcrumbs={breadcrumbs}
      actions={
        <ButtonGroup>
          <Button
            onClick={() => setGridView(true)}
            appearance={gridView ? 'primary' : ''}
            shape="square"
          >
            <MdGridView
              style={{ ...(theme === 'dark' && { color: '#fff' }) }}
            />
          </Button>
          <Button
            onClick={() => setGridView(false)}
            appearance={!gridView ? 'primary' : ''}
            shape="square"
          >
            <RiListCheck2
              style={{ ...(theme === 'dark' && { color: '#fff' }) }}
            />
          </Button>
          <Button
            title={translate('PROJECTS.CREATE_PROJECT')}
            appearance="primary"
            onClick={() => navigate('/dashboard/projects/create')}
          />
        </ButtonGroup>
      }
    >
      {gridView ? (
        <Container>
          {projects.map((project, index) => (
            <ContainerItem sm={4} md={4} xl={4} key={index}>
              <CardContainer>
                <ProjectGrid data={project} />
              </CardContainer>
            </ContainerItem>
          ))}
        </Container>
      ) : (
        <ProjectList data={projects} />
      )}
    </AppPage>
  )
}
