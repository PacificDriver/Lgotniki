import { useFormatValue } from '../../../../hooks/useFormatValue'
import { formatWithUnits } from '../../../../utils/utils'

const lang = JSON.parse(localStorage.getItem('lang') || '')

const currencySymbols = {
  'en-US': '$',
  'pt-BR': 'R$',
  'es-ES': '€',
  'fr-FR': '€',
  'it-IT': '€',
  'de-DE': '€',
}

const formatLabels = (typeOfInformation = '') => {
  const symbol = typeOfInformation === 'money' ? currencySymbols[lang] : ''

  return {
    formatter: value => {
      const formattedValue = formatWithUnits(value)

      return `${['en-US', 'pt-BR'].includes(lang) ? `${symbol}${formattedValue}` : `${formattedValue}${symbol}`}`
    },
  }
}

const formatTooltip = (theme, series, seriesTypeMap) => {
  const formatValue = useFormatValue

  return {
    tooltip: {
      theme: theme,
      y: {
        formatter: (value, { seriesIndex }) => {
          const seriesName = series[seriesIndex].name
          const typeOfInformation = seriesTypeMap[seriesName]
          return formatValue(value, typeOfInformation)
        },
      },
    },
  }
}

export { formatLabels, formatTooltip }
