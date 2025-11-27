import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'

import { translate } from '../../../../hooks/translate'
import { useModalConfirm as confirm } from '../../../../hooks/useModalConfirm'
import useDownloadZip from '../../../../hooks/useDownloadZip'

import {
  deleteFolder,
  getAllFiles,
  renameFolder,
} from '../../../../services/files'

import Container from '../../../../components/CustomUI/Container'
import ContainerItem from '../../../../components/CustomUI/Container/ContainerItem'
import DropdownMenu from '../../../../components/CustomUI/DropdownMenu'
import Files from '../../../../components/CustomUI/Files'
import {
  Modal,
  ModalBody,
  ModalHeader,
} from '../../../../components/BaseUI/Modal'
import Input from '../../../../components/BaseUI/Input'
import Button from '../../../../components/BaseUI/Button'
import ButtonGroup from '../../../../components/BaseUI/ButtonGroup'
import { ToastContainer, Toast } from '../../../../components/CustomUI/Toast'
import DisplayListOfFilesAndFolders from '../DisplayListOfFilesAndFolders'

import { HiFolderOpen } from 'react-icons/hi2'

import { folderDropdownOptions } from '../data'

import styles from '../FileManager.module.scss'

export default function ListFiles() {
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [mainFiles, setMainFiles] = useState([]) // Para armazenar os arquivos da rota principal
  const [currentFolder, setCurrentFolder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [toast, setToast] = useState({})

  const { id: uuid } = useParams()
  const { reload, currentView } = useOutletContext()

  const navigate = useNavigate()
  const { downloadZip } = useDownloadZip()

  const loadFiles = async () => {
    setLoading(true)
    const response = await getAllFiles()

    setFolders(response?.folders)
    setFiles(response?.files)
    setMainFiles(response?.files)
    setLoading(false)
  }

  useEffect(() => {
    loadFiles()
  }, [])

  useEffect(() => {
    if (reload) {
      loadFiles()
    }
  }, [reload])

  useEffect(() => {
    const findFolderByUuid = (folders, uuid) => {
      for (const folder of folders) {
        if (folder.hash === uuid) {
          return folder
        }

        if (folder.subfolders) {
          const found = findFolderByUuid(folder.subfolders, uuid)
          if (found) {
            return found
          }
        }
      }
      return null
    }

    if (uuid) {
      const foundFolder = findFolderByUuid(folders, uuid)
      setCurrentFolder(foundFolder)
      setFiles(foundFolder?.files)
    } else {
      setCurrentFolder(null)
      setFiles(mainFiles)
    }
  }, [uuid, folders])

  const handleFolderClick = hash => {
    navigate(`/dashboard/file-manager/folders/${hash}`)
  }

  const handleClickOnDropdownBox = (action, folder) => {
    if (action === 'getLink') {
      const link = `${process.env.REACT_APP_API_URL}#/dashboard/file-manager/folders/${folder?.hash}`

      setToast({
        id: 1,
        key: 1,
        title: 'Link gerado com sucesso!',
        description: link,
      })
    }

    if (action === 'download') {
      downloadZip(folder)
    }

    if (action === 'rename') {
      setCurrentFolder(folder)
      setOpenModal(true)
    }

    if (action === 'remove') {
      confirm({
        title: `${translate('UI.DELETE')} ${folder?.name}?`,
        message:
          'You are about to permanently delete this item and everything linked to it. If you are not sure whether you want to do this, resolve or close this item.',
        appearance: 'danger',
        confirmButtonText: translate('UI.DELETE'),
        onConfirm: async () => {
          await deleteFolder(folder?.id)
          loadFiles()
        },
      })
    }
  }

  const handleFolderRenaming = async () => {
    await renameFolder(currentFolder?.id, currentFolder?.name)
    loadFiles()
    setOpenModal(false)
  }

  const renderFolders = foldersToRender => {
    return foldersToRender.map((folder, index) => (
      <ContainerItem
        key={index}
        sm={4}
        md={4}
        xl={4}
        className={styles['folder-card']}
        onDoubleClick={() => handleFolderClick(folder?.hash)}
      >
        <div className={styles['folder-card__header']}>
          <div className={styles['folder-card__header__icon']}>
            {folder?.icon || <HiFolderOpen />}
          </div>
          <div>
            <DropdownMenu
              options={folderDropdownOptions}
              direction="right"
              horizontalIcon
              dropdownMenuContentClass={styles['folder-card__header__dropdown']}
              onClicked={({ action }) =>
                handleClickOnDropdownBox(action, folder)
              }
            />
          </div>
        </div>

        <div className={styles['folder-card__body']}>{folder?.name}</div>

        <div className={styles['folder-card__footer']}>
          <div>{folder?.fileCount} Files</div>
          <div>{folder?.size}</div>
        </div>
      </ContainerItem>
    ))
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {currentView === 'grid' ? (
        <>
          {(currentFolder?.subfolders?.length > 0 || !currentFolder) &&
            folders?.length > 0 && (
              <>
                <div>
                  <h5 className={styles['folders-title']}>
                    {translate('FILEMANAGER.FOLDERS')}
                  </h5>
                </div>

                <Container>
                  {currentFolder
                    ? renderFolders(currentFolder.subfolders || [])
                    : renderFolders(folders)}
                </Container>
              </>
            )}

          {files?.length > 0 && (
            <div className="mt-4">
              <h5 className={styles['folders-title']}>
                {translate('UI.FILES')}
              </h5>
              <Files files={files} />
            </div>
          )}
        </>
      ) : (
        <div>
          <DisplayListOfFilesAndFolders
            data={
              currentFolder
                ? [
                    ...(Array.isArray(currentFolder?.subfolders)
                      ? currentFolder.subfolders
                      : []),
                    ...files,
                  ]
                : [...folders, ...files]
            }
          />
        </div>
      )}

      <Modal isOpen={openModal} width="small">
        <ModalHeader>{translate('FILEMANAGER.RENAME_FOLDER')}</ModalHeader>

        <ModalBody>
          <Input
            type="text"
            value={currentFolder?.name}
            onFocused
            onChange={value =>
              setCurrentFolder({ ...currentFolder, name: value })
            }
          />

          <div className="my-3">
            <ButtonGroup placement="end">
              <Button appearance="subtle" onClick={() => setOpenModal(false)}>
                {translate('UI.CANCEL')}
              </Button>
              <Button appearance="primary" onClick={handleFolderRenaming}>
                {translate('UI.SAVE')}
              </Button>
            </ButtonGroup>
          </div>
        </ModalBody>
      </Modal>

      {toast?.id && (
        <ToastContainer onDismissed={() => setToast({})}>
          <Toast {...toast} isExpanded />
        </ToastContainer>
      )}
    </div>
  )
}
