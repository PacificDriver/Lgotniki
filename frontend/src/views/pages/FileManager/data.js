import { FiLink, FiDownload, FiEdit, FiTrash2 } from 'react-icons/fi'
import { translate } from '../../../hooks/translate'

const folderDropdownOptions = [
  {
    name: translate('FILEMANAGER.GET_LINK'),
    icon: <FiLink />,
    action: 'getLink',
  },
  {
    name: translate('FILEMANAGER.DOWNLOAD'),
    icon: <FiDownload />,
    action: 'download',
  },
  { name: translate('FILEMANAGER.RENAME'), icon: <FiEdit />, action: 'rename' },
  { name: translate('UI.DELETE'), icon: <FiTrash2 />, action: 'remove' },
]

export { folderDropdownOptions }
