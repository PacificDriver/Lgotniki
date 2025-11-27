import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid'
import { translate } from '../../../../hooks/translate'
import { useTheme } from '../../../../hooks/useTheme'
import StrictModeDroppable from '../StrictModeDroppable'

import AvatarGroup from '../../../BaseUI/AvatarGroup'
import Button from '../../../BaseUI/Button'
import ButtonGroup from '../../../BaseUI/ButtonGroup'
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
} from '../../../BaseUI/Dropdown'
import Input from '../../../BaseUI/Input'
import Label from '../../../BaseUI/Label'
import Lozenge from '../../../BaseUI/Lozenge'
import { Modal, ModalBody, ModalHeader } from '../../../BaseUI/Modal'
import Progress from '../../../BaseUI/Progress'
import Select from '../../../BaseUI/Select'
import DatePicker from '../../../CustomUI/DatePicker'
import DropdownMenu from '../../DropdownMenu'
import RichTextEditor from '../../RichTextEditor'

import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { MdAdd, MdAttachFile, MdMoreHoriz } from 'react-icons/md'

import usersJson from '../../../../mocks/users.json'

import styles from './Boards.module.scss'

export default function Boards({ items }) {
  const [sections, setSections] = useState([])
  const [titleCard, setTitleCard] = useState()
  const [newCard, setNewCard] = useState(null)
  const [editCard, setEditCard] = useState(false)
  const [currentCardEdit, setCurrentCardEdit] = useState(null)
  const [newList, setNewList] = useState({ creating: false, value: '' })

  const theme = useTheme()

  const dropdownOptions = [
    { name: translate('PROJECTS.EDIT_LIST'), action: 'edit', redirect: false },
    {
      name: translate('PROJECTS.DELETE_LIST'),
      action: 'delete',
      redirect: false,
    },
    {
      name: translate('PROJECTS.ARCHIVE_LIST'),
      action: 'archive',
      redirect: false,
    },
  ]
  const dropdownOptionsCard = [
    {
      name: translate('PROJECTS.EDIT_CARD'),
      action: 'edit',
      redirect: false,
      fn: (event, sectionIndex, itemIndex) =>
        handleKanbanEdit(event, sectionIndex, itemIndex),
    },
    {
      name: translate('PROJECTS.DELETE_CARD'),
      action: 'delete',
      redirect: false,
      fn: (event, sectionIndex, itemIndex) =>
        handleKanbanDelete(event, sectionIndex, itemIndex),
    },
    {
      name: translate('PROJECTS.ARCHIVE_CARD'),
      action: 'archive',
      redirect: false,
      fn: (event, sectionIndex, itemIndex) =>
        handleKanbanArchive(event, sectionIndex, itemIndex),
    },
  ]

  const priorityOptions = {
    low: {
      color: theme === 'dark' ? 'success' : 'success-subtle',
      value: translate('PROJECTS.LOW_PRIORITY'),
    },
    medium: {
      color: theme === 'dark' ? 'warning' : 'warning-subtle',
      value: translate('PROJECTS.MEDIUN_PRIORITY'),
    },
    high: {
      color: theme === 'dark' ? 'danger' : 'danger-subtle',
      value: translate('PROJECTS.HIGH_PRIORITY'),
    },
  }

  const users = usersJson?.map(user => ({ value: user.id, label: user.name }))

  useEffect(() => {
    setSections(items)
  }, [items])

  const handleDropdownSelection = (value, section) => {
    if (value === 'addNewCard') {
      return addNewcard(section)
    }

    archiveList(section)
  }

  const addNewcard = section => {
    const items = sections

    items?.forEach(item => {
      item.addCard = false

      if (item.id === section.id) item.addCard = true
    })

    setSections([...items])
  }

  const handleAddingNewCard = section => {
    const items = sections

    items?.forEach(item => {
      if (item.id === section.id) {
        item?.items.push({
          id: uuidv4(),
          title: titleCard,
          category: 'Branding',
          priority: 'low',
          className: 'badge-success-outline',
          contributors: [{ value: 1, name: 'Carolina Ferreira', image: '' }],
          completedTasks: 0,
          totalTasks: 0,
          startDate: moment().format('YYYY-MM-DD'),
          endDate: null,
          lastUpdated: null,
          concluded: false,
          description: '',
          comments: 0,
          attachments: 0,
        })
      }

      item.addCard = false
    })

    localStorage.removeItem('boards')
    localStorage.setItem('boards', JSON.stringify(items))

    setSections([...items])
  }

  const archiveList = () => {}

  const handleKanbanEdit = (event, sectionIndex, itemIndex) => {
    setEditCard(!editCard)
    setCurrentCardEdit(sections[sectionIndex].items[itemIndex])
    setNewCard({
      ...newCard,
      sectionIndex,
      itemIndex,
    })
  }

  const handleKanbanDelete = (event, sectionIndex, itemIndex) => {
    event.stopPropagation()

    const items = sections

    items[sectionIndex].items.splice(itemIndex, 1)

    localStorage.removeItem('boards')
    localStorage.setItem('boards', JSON.stringify(items))

    setSections([...items])
  }

  const handleKanbanArchive = () => {}

  const handleAddCard = () => {
    const items = sections[newCard?.sectionIndex]?.items

    items?.forEach(item => {
      if (item?.id === currentCardEdit?.id) {
        items[newCard?.itemIndex] = { ...item, ...newCard }
      }
    })

    const newCollection = sections

    newCollection[newCard?.sectionIndex].items = items

    localStorage.removeItem('boards')
    localStorage.setItem('boards', JSON.stringify(newCollection))

    setSections([...newCollection])
    setEditCard(false)
    setCurrentCardEdit(null)
  }

  const cancelCreation = () => {
    const items = sections

    items?.forEach(item => (item.addCard = false))

    setSections([...items])
  }

  const handleAddingNewList = () => {
    const boards = sections

    boards.push({
      id: uuidv4(),
      title: newList.value,
      items: [],
    })

    localStorage.removeItem('boards')
    localStorage.setItem('boards', JSON.stringify(boards))

    setSections([...boards])
    setNewList({ creating: false, value: '' })
  }

  return (
    <div className={`${styles['kanban-container']} ${styles[theme]}`}>
      {sections?.map((section, sectionIndex) => (
        <StrictModeDroppable key={section.id} droppableId={section.id}>
          {provided => (
            <div
              {...provided.droppableProps}
              className={`${styles['kanban-container__section']}`}
              ref={provided.innerRef}
            >
              <div className={styles['kanban-container__section__header']}>
                <div
                  className={styles['kanban-container__section__header--title']}
                >
                  {section.title}
                </div>
                <div>
                  <DropdownMenu
                    options={dropdownOptions}
                    onClicked={value => handleDropdownSelection(value, section)}
                  />
                </div>
              </div>

              <div className={styles['kanban-container__section__content']}>
                {section.items.map((item, itemIndex) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={itemIndex}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? '0.8' : '1',
                        }}
                        className={styles['content-item']}
                      >
                        <div className={`d-flex flex-column gap-1`}>
                          <div className={styles['content-item__header']}>
                            <span
                              className={styles['content-item__header--title']}
                            >
                              {item.title}
                            </span>

                            <Dropdown
                              trigger={
                                <div
                                  className={
                                    styles['content-item__header--delete']
                                  }
                                >
                                  <MdMoreHoriz />
                                </div>
                              }
                              placement="right"
                              triggerClassName={styles['custom__dropdown']}
                              hideDropdownIcon={true}
                            >
                              <DropdownContent>
                                {dropdownOptionsCard.map((option, index) => (
                                  <DropdownItem
                                    key={index}
                                    onClick={event =>
                                      option?.fn(event, sectionIndex, itemIndex)
                                    }
                                  >
                                    <span>{option?.name}</span>
                                  </DropdownItem>
                                ))}
                              </DropdownContent>
                            </Dropdown>
                          </div>
                          <div>
                            <Lozenge
                              appearance={priorityOptions[item.priority]?.color}
                            >
                              {priorityOptions[item.priority]?.value}
                            </Lozenge>
                          </div>
                        </div>

                        <div className={styles['content-item__description']}>
                          {item?.description?.length > 55
                            ? `${item?.description?.substring(0, 55)}...`
                            : item?.description}
                        </div>

                        <div className={`py-3`}>
                          <Progress
                            progress={
                              item.totalTasks
                                ? (
                                    (item.completedTasks / item.totalTasks) *
                                    100
                                  ).toFixed(0)
                                : 0
                            }
                            height="5px"
                            background={
                              theme === 'dark' ? '#abafbc' : '#dadada'
                            }
                            color="#005FED"
                            showProgress={true}
                          />
                        </div>

                        <div
                          className={`d-flex justify-content-between align-items-center`}
                        >
                          <AvatarGroup
                            data={item?.contributors}
                            max={3}
                            borderColor={theme === 'dark' ? '#8D8DA4' : ''}
                          />

                          <div className={styles['board-quantity']}>
                            <div className={styles['board-quantity__item']}>
                              <MdAttachFile
                                className={styles['board-quantity__item--icon']}
                              />
                              <span
                                className={
                                  styles['board-quantity__item--label']
                                }
                              >
                                {item?.attachments}
                              </span>
                            </div>

                            <div className={styles['board-quantity__item']}>
                              <IoChatbubbleEllipsesOutline
                                className={styles['board-quantity__item--icon']}
                              />
                              <span
                                className={
                                  styles['board-quantity__item--label']
                                }
                              >
                                {item?.comments}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                {!section?.addCard && (
                  <div
                    className={
                      styles['kanban-container__section__content--create']
                    }
                    onClick={() =>
                      handleDropdownSelection('addNewCard', section)
                    }
                  >
                    <MdAdd
                      className={
                        styles[
                          'kanban-container__section__content--create--icon'
                        ]
                      }
                    />
                  </div>
                )}

                {section?.addCard && (
                  <div>
                    <Input
                      type="text"
                      value={titleCard}
                      onFocused={true}
                      onChange={event => setTitleCard(event.target.value)}
                    />

                    <div className="mb-3"></div>

                    <ButtonGroup>
                      <Button
                        title={translate('UI.ADD')}
                        appearance="primary"
                        onClick={() => handleAddingNewCard(section)}
                      />
                      <Button
                        title={translate('UI.CANCEL')}
                        appearance="soft-link"
                        onClick={cancelCreation}
                      />
                    </ButtonGroup>
                  </div>
                )}
              </div>
            </div>
          )}
        </StrictModeDroppable>
      ))}

      <div className={`${styles['kanban-container__create']}`}>
        {!newList?.creating && (
          <Button
            appearance="primary"
            onClick={() => setNewList({ creating: true })}
          >
            <MdAdd className={`${styles['kanban-container__create--icon']}`} />{' '}
            {translate('PROJECTS.ADD_ANOTHER_LIST')}
          </Button>
        )}

        {newList?.creating && (
          <div>
            <Input
              type="text"
              onFocused={true}
              onChange={event =>
                setNewList({ ...newList, value: event.target.value })
              }
            />

            <div className="mb-3"></div>

            <ButtonGroup>
              <Button
                title={translate('PROJECTS.ADD_LIST')}
                appearance="primary"
                onClick={handleAddingNewList}
              />
              <Button
                title={translate('UI.CANCEL')}
                appearance="soft"
                onClick={() => setNewList({ creating: false, value: '' })}
              />
            </ButtonGroup>
          </div>
        )}
      </div>

      <Modal
        isOpen={editCard}
        alignment="center"
        size="medium"
        onClose={() => setEditCard(false)}
      >
        <ModalHeader>{translate('PROJECTS.UPDATE_CARD')}</ModalHeader>

        <ModalBody>
          <Input
            type="text"
            label={translate('UI.NAME')}
            value={currentCardEdit?.title}
            onChange={event =>
              setNewCard({ ...newCard, title: event.target.value })
            }
          />

          <Label>Descrição</Label>
          <RichTextEditor
            placeholder={translate('PROJECTS.ADD_A_DESCRIPTION')}
            content={currentCardEdit?.description}
            onChange={({ content }) =>
              setNewCard({ ...newCard, description: content.html })
            }
            useBorder
          />

          <Select
            label={translate('UI.CATEGORY')}
            unique={true}
            options={[
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Coaching', label: 'Coaching' },
              { value: 'Design System', label: 'Design System' },
              { value: 'Desktop', label: 'Desktop' },
              { value: 'Branding', label: 'Branding' },
              { value: 'UX/UI', label: 'UX/UI' },
            ]}
            onSelected={value =>
              setNewCard({ ...newCard, category: value?.[0].value })
            }
            selected={[currentCardEdit?.category]}
          />

          <Select
            label={translate('PROJECTS.PRIORITY')}
            unique={true}
            options={[
              { value: 'low', label: translate('PROJECTS.LOW_PRIORITY') },
              { value: 'medium', label: translate('PROJECTS.MEDIUN_PRIORITY') },
              { value: 'high', label: translate('PROJECTS.HIGH_PRIORITY') },
            ]}
            onSelected={value =>
              setNewCard({ ...newCard, priority: value?.[0].value })
            }
            selected={[currentCardEdit?.priority]}
          />

          <Select label={translate('PROJECTS.MEMBERS')} options={users} />

          <DatePicker
            label={translate('PROJECTS.DEADLINE')}
            onChange={value => setNewCard({ ...newCard, endDate: value })}
          />

          <div className="my-3">
            <ButtonGroup placement="end">
              <Button appearance="soft-link" onClick={() => setEditCard(false)}>
                {translate('UI.CANCEL')}
              </Button>
              <Button appearance="primary" onClick={() => handleAddCard()}>
                {translate('UI.SAVE')}
              </Button>
            </ButtonGroup>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}
