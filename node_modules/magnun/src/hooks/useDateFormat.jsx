import config from '../config/config'

const language = config.i18n.defaultLanguage

const useDateFormat = value =>
  new Date(value?.replaceAll('-', '/')).toLocaleDateString(language)

export default useDateFormat
