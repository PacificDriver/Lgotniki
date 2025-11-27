import React from 'react'

import { translate } from '../../../hooks/translate'

import DropdownMenu from '../DropdownMenu'

import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md'
import { MdOutlineFileDownload } from 'react-icons/md'
import { MdOutlineDelete } from 'react-icons/md'

import styles from './Folders.module.scss'

export default function Folders({ folders }) {
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

  return (
    <div className={styles['folders-container']}>
      {folders?.map((folder, index) => (
        <div key={index} className={styles['folders-container__list']}>
          <div className={styles['folder-info']}>
            <div className={styles['folder-info--icon']}>{folder.icon}</div>
            <div className={styles['folder-info--name']}>{folder.name}</div>
          </div>

          <div style={{ position: 'relative' }}>
            <DropdownMenu options={dropdownOptions} />
          </div>
        </div>
      ))}
    </div>
  )
}
