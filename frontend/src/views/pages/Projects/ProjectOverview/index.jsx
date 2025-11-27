import React, { useState } from 'react'

import { translate } from '../../../../hooks/translate'
import { useFormatValue } from '../../../../hooks/useFormatValue'
import { extensionGroup, extensions } from '../../../../utils/extensions'

import { Comment, CommentAction } from '../../../../components/BaseUI/Comment'
import Label from '../../../../components/BaseUI/Label'
import ListGroup from '../../../../components/BaseUI/ListGroup'
import ListItem from '../../../../components/BaseUI/ListGroup/ListItem'
import Lozenge from '../../../../components/BaseUI/Lozenge'
import AppPage from '../../../../components/CustomUI/AppPage'
import Avatar from '../../../../components/CustomUI/Avatar'
import CardContainer from '../../../../components/CustomUI/CardContainer'
import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'
import Picture from '../../../../components/CustomUI/Picture'
import RenderHTML from '../../../../components/CustomUI/RenderHTML'
import RichTextEditor from '../../../../components/CustomUI/RichTextEditor'

import { MdOutlineCalendarMonth } from 'react-icons/md'

import './style.scss'

export default function ProjectOverview() {
  const [comments, setComments] = useState([
    {
      author: 'Laura Oriveira',
      image: '',
      comment:
        'Estou enfrentando alguns impeditivos nesta demanda. Alguém poderia me ajudar?',
      time: '2024-04-02',
    },
    {
      author: 'Stefanny Coímbra',
      image: '',
      comment: 'Pessoal, finalizei a prototipação dos designs',
      time: '2024-03-27',
    },
  ])

  const files = [
    { name: 'Atlassian Git Cheatsheet', type: 'application/pdf' },
    {
      name: 'Git Cheatsheet',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    { name: 'Squirrel 82', type: 'image/jpeg' },
    { name: 'Um Olhar Profundo', type: 'text/plain' },
  ]

  const icons = {
    image: require('../../../../assets/extensions/picture.png'),
    excel: require('../../../../assets/extensions/excel.png'),
    word: require('../../../../assets/extensions/word.png'),
    pdf: require('../../../../assets/extensions/pdf.png'),
    txt: require('../../../../assets/extensions/txt.png'),
  }

  const format = useFormatValue

  const contribuitors = [
    { name: 'Ana MacLister', image: '', team: 'Product Manager' },
    { name: 'Paul MacLister', image: '', team: 'Back-end' },
    { name: 'Victor Gonzalez', image: '', team: 'QA' },
    { name: 'Laura Oriveira', image: '', team: 'Front-end' },
    { name: 'Stefanny Coímbra', image: '', team: 'UX/UI' },
    { name: 'William Jacob Moore', image: '', team: 'DBA' },
    { name: 'Charlotte Amelia Harris', image: '', team: 'Tech Lead' },
  ]

  const { word, pdf, image, excel, txt } = extensionGroup

  const getExtension = type => {
    const extensions = {
      [word]: 'word',
      [pdf]: 'pdf',
      [excel]: 'excel',
      [image]: 'image',
      [txt]: 'txt',
    }

    for (const extensionArray of Object.keys(extensions)) {
      if (extensionArray.includes(type)) {
        return extensions[extensionArray]
      }
    }

    return ''
  }

  const hadleNewComment = content => {
    setComments([
      ...comments,
      {
        author: 'Beatriz Lopes',
        image: '',
        comment: content,
        time: new Date(),
      },
    ])
  }

  return (
    <AppPage
      title={translate('PROJECTS.PROJECT_OVERVIEW')}
      className="project-overview"
    >
      <Container>
        <ContainerItem sm={4} md={8} xl={8}>
          <CardContainer title="Learn PHP" className="px-3 pb-3">
            <div className="mb-5">
              <RenderHTML>
                {`<p>The project involves developing a web application for task management. The application will allow users to create accounts, log in, and efficiently manage their tasks.</p>
                            <h4>Main Features:</h4>
                            <ul>
                            <li><strong>User Authentication:</strong> Users can register, log in, and update their profile information.</li>
                            <li><strong>Task Creation and Management:</strong> Users can add new tasks, set priorities, assign deadlines and categories, as well as mark tasks as completed.</li>
                            <li><strong>Notifications:</strong> The application will send email notifications for task reminders nearing their due dates.</li>
                            </ul>
                            <h4>Technologies Used:</h4>
                            <p>The project will be developed using PHP as the main server-side language, along with HTML, CSS, and JavaScript for the front end. The MySQL database will be used to store user and task information.</p>`}
              </RenderHTML>
            </div>

            <div className="d-flex align-items-center gap-5 flex-wrap">
              <div className="d-flex flex-column gap-1">
                <Label>{translate('UI.INITIAL_DATE')}</Label>
                <div className="d-flex align-items-center">
                  <MdOutlineCalendarMonth />
                  <span className="ml-1">{format('2022-10-03', 'date')}</span>
                </div>
              </div>

              <div className="d-flex flex-column gap-1">
                <Label>{translate('UI.FINAL_DATE')}</Label>
                <div className="d-flex align-items-center">
                  <MdOutlineCalendarMonth />
                  <span className="ml-1">{format('2023-04-12', 'date')}</span>
                </div>
              </div>

              <div className="d-flex flex-column gap-1">
                <Label>{translate('PROJECTS.BUDGET')}</Label>
                <div>{format(48372.76, 'money')}</div>
              </div>
            </div>
          </CardContainer>
        </ContainerItem>

        <ContainerItem sm={4} md={8} xl={4}>
          <CardContainer
            title={translate('PROJECTS.PROJECT_TEAM')}
            className="px-3"
          >
            <ListGroup borderless={true}>
              {contribuitors?.map((contribuitor, index) => (
                <ListItem key={index}>
                  <div className="d-flex align-items-center gap-1">
                    <Avatar src={contribuitor.image} name={contribuitor.name} />
                    <div>{contribuitor.name}</div>
                  </div>

                  <div>
                    <Lozenge appearance="info-subtle" isBold isUpper>
                      {contribuitor.team}
                    </Lozenge>
                  </div>
                </ListItem>
              ))}
            </ListGroup>
          </CardContainer>
        </ContainerItem>

        <ContainerItem sm={4} md={5} xl={8}>
          <CardContainer title={translate('UI.COMMENTS')} className="px-3 pb-3">
            <div className="d-flex align-items-start gap-1 mb-3">
              <div>
                <Avatar name="Beatriz Lopes" />
              </div>
              <div className="w-100 pl-1">
                <RichTextEditor
                  placeholder={`${translate('UI.ADD_COMMENT')}...`}
                  onSaved={({ content }) => hadleNewComment(content?.html)}
                  useBorder
                />
              </div>
            </div>

            {comments?.map((comment, index) => (
              <Comment
                key={index}
                avatar={comment?.image}
                author={comment?.author}
                content={comment?.comment}
                time={comment?.time}
                actions={[
                  // eslint-disable-next-line react/jsx-key
                  <CommentAction>
                    {translate('EMAIL.TO_RESPOND')}
                  </CommentAction>,
                  // eslint-disable-next-line react/jsx-key
                  <CommentAction>{translate('UI.EDIT')}</CommentAction>,
                  // eslint-disable-next-line react/jsx-key
                  <CommentAction>{translate('UI.LIKE')}</CommentAction>,
                ]}
              />
            ))}
          </CardContainer>
        </ContainerItem>

        <ContainerItem sm={4} md={3} xl={4}>
          <CardContainer title={translate('UI.FILES')} className="px-3 pb-3">
            <div className="w-100">
              {files.map((file, index) => (
                <div key={index} className="file__custom">
                  <div className="u-ellipsis">
                    <div className="d-flex align-items-center gap-1">
                      <Picture image={icons[getExtension(file?.type)]} />
                      <div
                        className="u-ellipsis"
                        title={`${file.name}.${extensions[file?.type]}`}
                      >
                        <span
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {file.name}
                        </span>
                        .{extensions[file?.type]}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="material-symbols-outlined u-pointer">
                      download
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContainer>
        </ContainerItem>
      </Container>
    </AppPage>
  )
}
