import React, { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { translate } from '../../../hooks/translate'
import { createFolder } from '../../../services/files'

import Button from '../../../components/BaseUI/Button'
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
} from '../../../components/BaseUI/Dropdown'
import Input from '../../../components/BaseUI/Input'
import { Modal, ModalBody, ModalHeader } from '../../../components/BaseUI/Modal'
import AppPage from '../../../components/CustomUI/AppPage'

import {
  MdGridView,
  MdOutlineCreateNewFolder,
  MdOutlineDriveFolderUpload,
  MdOutlineUploadFile,
} from 'react-icons/md'
import { RiListCheck2 } from 'react-icons/ri'

import styles from './FileManager.module.scss'

const actions = [
  {
    label: 'Nova pasta',
    icon: <MdOutlineCreateNewFolder />,
    action: 'createFolder',
  },
  {
    label: 'Carregar pasta',
    icon: <MdOutlineDriveFolderUpload />,
    action: 'uploadFolder',
  },
  {
    label: 'Fazer upload de arquivos',
    icon: <MdOutlineUploadFile />,
    action: 'uploadFile',
  },
]

export default function FileManager() {
  const [currentView, setCurrentView] = useState('grid')
  const [newFolder, setNewFolder] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [reload, setReload] = useState(false)
  const [gridView, setGridView] = useState([
    { active: false, type: 'list' },
    { active: true, type: 'grid' },
  ])

  const param = useParams()

  const handleChangeActiveGridView = value => {
    setGridView([...gridView])
    setCurrentView(value)
  }

  const handleClick = action => {
    if (action === 'createFolder') {
      setOpenModal(true)
    }
  }

  const handleFolderCreation = async () => {
    await createFolder(newFolder, param?.id)
    setOpenModal(false)
    setReload(true)

    setTimeout(() => {
      setReload(false)
    }, 2000)
  }

  return (
    <AppPage
      title={translate('FILEMANAGER.ALL_FILE')}
      className={styles['file-manager-container']}
      actions={
        <div className="d-flex align-items-center">
          <div className={styles['actions']}>
            <div
              onClick={() => handleChangeActiveGridView('grid')}
              className={`${currentView === 'grid' ? styles['active'] : ''}`}
            >
              <MdGridView />
            </div>

            <div
              onClick={() => handleChangeActiveGridView('list')}
              className={`${currentView === 'list' ? styles['active'] : ''}`}
            >
              <RiListCheck2 />
            </div>
          </div>

          <Dropdown
            trigger={<Button appearance="primary">{translate('New')}</Button>}
            hideDropdownIcon={true}
            placement="right"
          >
            <DropdownContent
              className={
                styles['file-manager-container__create-event-container']
              }
            >
              {actions?.map(({ label, icon, action }, index) => (
                <DropdownItem key={index} onClick={() => handleClick(action)}>
                  <span>{icon}</span>
                  <span>{label}</span>
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        </div>
      }
    >
      <div className={styles['file-manager-container__content']}>
        <Outlet context={{ reload, currentView }} />
      </div>

      <Modal isOpen={openModal} width="small">
        <ModalHeader>Nova pasta</ModalHeader>

        <ModalBody>
          <Input
            type="text"
            onFocused
            onChange={event => setNewFolder(event.target.value)}
          />

          <div className="w-100 d-flex align-items-center justify-content-end gap-1 my-3">
            <Button appearance="subtle" onClick={() => setOpenModal(false)}>
              Cancelar
            </Button>
            <Button appearance="primary" onClick={handleFolderCreation}>
              Criar
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </AppPage>
  )
}
