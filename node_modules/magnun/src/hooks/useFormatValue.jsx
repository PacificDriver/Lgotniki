import currencyOptions from '../utils/formatters/currencyToLocale'

export const useFormatValue = (value, type = '', precision = 0) => {
  const lang = localStorage.getItem('lang')?.split('"')[1] || null

  const currency = Object.keys(currencyOptions.options).find(key =>
    currencyOptions.options[key]?.includes(lang)
  )

  const config = {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }

  if (!type) return value
  if (type === 'percentage')
    return `${new Intl.NumberFormat(lang, config).format(value)}%`
  if (type === 'number')
    return new Intl.NumberFormat(lang, config).format(value)
  if (type === 'money')
    return new Intl.NumberFormat(lang, {
      style: 'currency',
      currency: currency,
      ...config,
    }).format(value)
  if (type === 'date') return new Date(value).toLocaleDateString(lang)

  return value
}
