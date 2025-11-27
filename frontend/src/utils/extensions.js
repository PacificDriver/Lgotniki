const extensions = {
  'application/pdf': 'pdf',
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/gif': 'gif',
  'text/csv': 'csv',
  'application/msword': 'doc',
  'vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'video/x-msvideo': 'avi',
  'video/mpeg': 'mpeg',
  'video/ogg': 'ogv',
  'video/webm': 'webm',
  'video/3gpp': '3gp',
  'video/mp4': 'mp4',
  'audio/mp4': 'mp4',
  'audio/ogg': 'ogg',
  'audio/mpeg': 'mpeg',
  'text/plain': 'txt',
}

const extensionGroup = {
  word: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pplication/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  video: [
    'video/x-msvideo',
    'video/mpeg',
    'video/ogg',
    'video/webm',
    'video/3gpp',
    'video/mp4',
  ],
  excel: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  image: ['image/png', 'image/jpeg', 'image/gif'],
  audio: ['audio/mp4', 'audio/ogg', 'audio/mpeg', 'audio/wav'],
  pdf: ['application/pdf'],
  csv: ['text/csv'],
  txt: ['text/plain'],
}

export { extensions, extensionGroup }
