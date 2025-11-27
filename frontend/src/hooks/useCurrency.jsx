import config from '../config/config'

const currency = config.formatting.currency

const useCurrency = value =>
  value.toLocaleString(currency.language, {
    style: 'currency',
    currency: currency.name,
  })

export default useCurrency
