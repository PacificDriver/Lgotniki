import React from 'react'

import { translate } from '../../../hooks/translate'

import { Table, Tr, Td } from '../../BaseUI/Table'
import DropdownMenu from '../DropdownMenu'

import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md'
import { MdOutlineFileDownload } from 'react-icons/md'
import { MdOutlineDelete } from 'react-icons/md'

import './style.scss'

export default function DisplayListOfFilesAndFolders({ items }) {
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
    pdf: require('../../../assets/extensions/pdf.png'),
    excel: require('../../../assets/extensions/excel.png'),
    image: require('../../../assets/extensions/picture.png'),
    word: require('../../../assets/extensions/word.png'),
    audio: require('../../../assets/extensions/audio.png'),
    video: require('../../../assets/extensions/video.png'),
    txt: require('../../../assets/extensions/txt.png'),
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
    { name: translate('UI.NAME'), resizable: true },
    { name: translate('FILEMANAGER.LATEST_MODIFICATION'), resizable: true },
    { name: translate('FILEMANAGER.FILE_SIZE'), resizable: true },
    { name: translate('UI.ACTIONS') },
  ]

  const getIcon = type => {
    return icons[extensions[type]]
  }

  return (
    <Table
      title={translate('FILEMANAGER.LIST_OF_FILES_AND_FOLDERS')}
      columns={headers}
      identifier="file_list"
      pagination={true}
    >
      {items?.map((item, index) => (
        <Tr key={index} className="table-line">
          <Td className="d-flex align-items-center gap-1">
            {item?.type && (
              <div className="d-flex align-items-center gap-1">
                <img src={getIcon(item.type)} alt={item?.name} width="20" />

                <div>{item.name}</div>
              </div>
            )}

            {!item?.type && (
              <div className="file-list__folder-icon">
                <div className="mr-1">{item?.icon}</div>
                <div>{item.name}</div>
              </div>
            )}
          </Td>
          <Td>{item.date}</Td>
          <Td>3.2MB</Td>
          <Td>
            <DropdownMenu options={dropdownOptions} />
          </Td>
        </Tr>
      ))}
    </Table>
  )
}
