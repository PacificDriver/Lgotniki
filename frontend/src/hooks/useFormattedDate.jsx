import moment from 'moment'
import 'moment/locale/pt-br'
import 'moment/locale/es'

const getStoredLocale = () => {
  const locale =
    localStorage.getItem('lang')?.replace(/^"|"$/g, '')?.toLocaleLowerCase() ||
    'pt-br'
  const locales = {
    'en-us': 'en',
    'pt-br': 'pt-br',
    'es-es': 'es',
  }
  return locales[locale]
}

export const useFormattedDate = (date, outputFormat = '', inputFormat = '') => {
  const locale = getStoredLocale()
  moment.locale(locale)

  return moment(date, inputFormat).format(outputFormat)
}
