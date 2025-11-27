import React from 'react'
import { useNavigate } from 'react-router-dom'

import { translate } from '../../../../hooks/translate'
import { useFormattedDate as formatDate } from '../../../../hooks/useFormattedDate'

import { Table, Tr, Td } from '../../../../components/BaseUI/Table'
import DropdownMenu from '../../../../components/CustomUI/DropdownMenu'

import {
  MdOutlineRemoveRedEye,
  MdOutlineDriveFileRenameOutline,
  MdOutlineFileDownload,
  MdOutlineDelete,
} from 'react-icons/md'

import { HiFolderOpen } from 'react-icons/hi2'

import styles from './DisplayListOfFilesAndFolders.module.scss'

export default function DisplayListOfFilesAndFolders({ data }) {
  const dropdownOptions = [
    {
      name: translate('FILEMANAGER.VIEW'),
      icon: <MdOutlineRemoveRedEye />,
      redirect: false,
      action: 'view',
    },
    {
      name: translate('FILEMANAGER.RENAME'),
      icon: <MdOutlineDriveFileRenameOutline />,
      redirect: false,
      action: 'rename',
    },
    {
      name: translate('FILEMANAGER.DOWNLOAD'),
      icon: <MdOutlineFileDownload />,
      redirect: false,
      action: 'download',
    },
    {
      name: translate('UI.TO_REMOVE'),
      icon: <MdOutlineDelete />,
      redirect: false,
      action: 'delete',
    },
  ]

  const icons = {
    pdf: require('../../../../assets/extensions/pdf.png'),
    excel: require('../../../../assets/extensions/excel.png'),
    image: require('../../../../assets/extensions/picture.png'),
    word: require('../../../../assets/extensions/word.png'),
    audio: require('../../../../assets/extensions/audio.png'),
    video: require('../../../../assets/extensions/play.png'),
    txt: require('../../../../assets/extensions/txt.png'),
  }

  const extensions = {
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'word',
    'video/mp4': 'video',
    'audio/mpeg': 'audio',
    'image/jpeg': 'image',
    'text/plain': 'txt',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      'excel',
  }

  const headers = [
    { name: translate('UI.NAME'), dataType: 'text', width: 500 },
    {
      name: translate('FILEMANAGER.LATEST_MODIFICATION'),
      dataType: 'text',
      width: 200,
    },
    { name: translate('FILEMANAGER.FILE_SIZE'), dataType: 'text' },
    { name: translate('UI.ACTIONS'), width: 120 },
  ]

  const navigate = useNavigate()

  const getIcon = type => {
    return icons[extensions[type]]
  }

  const handleFolderClick = hash => {
    if (!hash) return

    navigate(`/dashboard/file-manager/folders/${hash}`)
  }

  return (
    <>
      {data?.length > 0 ? (
        <Table
          columns={headers}
          tableId="file_list"
          disableColumnMenu
          disableExport
          disableSearchFilter
          disableColumnResize
          disableLastColumnSorting
          className={styles['display-list-of-files-and-folders']}
        >
          {data?.map((item, index) => (
            <Tr
              key={index}
              id={item?.id}
              className="u-pointer"
              onDoubleClick={() => handleFolderClick(item?.hash)}
            >
              <Td className="d-flex align-items-center gap-1">
                <div>
                  {getIcon(item.type) ? (
                    <img src={getIcon(item.type)} alt={item?.name} width="20" />
                  ) : (
                    <span
                      className={
                        styles['display-list-of-files-and-folders__icon']
                      }
                    >
                      {item?.icon || <HiFolderOpen />}
                    </span>
                  )}
                </div>
                <div>{item?.name}</div>
              </Td>
              <Td>{formatDate(item?.updatedAt, 'DD MMM YYYY')}</Td>
              <Td>{item?.size || '0B'}</Td>
              <Td>
                <DropdownMenu options={dropdownOptions} horizontalIcon />
              </Td>
            </Tr>
          ))}
        </Table>
      ) : (
        <></>
      )}
    </>
  )
}
