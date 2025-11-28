const convertToBoolean = input => {
  if (!input) return undefined

  return typeof input === 'boolean' ? input : input === 'true'
}

const textTransform = (type, value) => {
  switch (type) {
    case 'lowercase':
      return value.toLowerCase()
    case 'uppercase':
      return value.toUpperCase()
    case 'capitalize':
      return value.charAt(0).toUpperCase() + value.slice(1)
    default:
      return 'Invalid transformation type'
  }
}

const generateSecureRandomString = (size = 20) => {
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charLength = char.length
  let randomString = ''

  for (let i = 0; i < size; i++) {
    const randomValue = window.crypto.getRandomValues(new Uint32Array(1))[0]
    randomString += char[randomValue % charLength]
  }

  return randomString
}

const formatFileSize = bytes => {
  if (bytes === 0) return '0 Byte'

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

const getFileSize = async url => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    const contentLength = response.headers.get('Content-Length')

    if (contentLength) {
      const sizeInBytes = parseInt(contentLength, 10)
      return {
        sizeInBytes,
        formattedSize: formatFileSize(sizeInBytes),
      }
    }
  } catch (error) {
    return null
  }
}

const getFile = async url => {
  const isValidUrl = url => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  try {
    if (isBlob(url) || url.startsWith('blob:')) {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Erro ao obter o blob: ${response.statusText}`)
      }

      const blob = await response.blob()
      return {
        headers: {
          contentType: blob.type,
          contentLength: blob.size,
          lastModified: null,
          etag: null,
        },
        content: blob,
      }
    } else {
      if (!isValidUrl(url)) {
        return {
          headers: {},
        }
      }
      const headResponse = await fetch(url, { method: 'HEAD' })

      if (!headResponse.ok) {
        throw new Error(`Erro ao obter os headers: ${headResponse.statusText}`)
      }

      const headers = {
        contentType: headResponse.headers.get('Content-Type'),
        contentLength: headResponse.headers.get('Content-Length'),
        lastModified: headResponse.headers.get('Last-Modified'),
        etag: headResponse.headers.get('ETag'),
      }

      const getResponse = await fetch(url)

      if (!getResponse.ok) {
        throw new Error(`Erro ao obter o conteúdo: ${getResponse.statusText}`)
      }

      const content = await getResponse.blob()

      return {
        headers,
        content,
      }
    }
  } catch (error) {
    return null
  }
}

const isBlob = value => {
  return value instanceof Blob
}

const createHash = async (id, length = 10) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(id)

  const cryptoObj =
    (typeof globalThis !== 'undefined' && globalThis.crypto) || null

  // crypto.subtle may be unavailable (plain HTTP) or in non-window contexts.
  if (cryptoObj?.subtle) {
    const hashBuffer = await cryptoObj.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    let hashBase64 = btoa(String.fromCharCode(...hashArray))

    hashBase64 = hashBase64.replace(/\+/g, '0').replace(/\//g, '1')
    return hashBase64.substring(0, length)
  }

  let simpleHash = 0
  for (let i = 0; i < data.length; i++) {
    simpleHash = (simpleHash << 5) - simpleHash + data[i]
    simpleHash |= 0
  }

  const fallback = btoa(Math.abs(simpleHash).toString()).replace(/=+/g, '')
  return fallback.substring(0, length)
}

const formatWithUnits = (value, precision = 0) => {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(precision) + 'B'
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(precision) + 'M'
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(precision) + 'K'
  }
  return value.toString()
}

/**
 * Calculates the percentage of change between a current value and a previous value.
 *
 * @param {number} currentValue - Current value.
 * @param {number} previousValue - Previous value.
 * @returns {number} - Percentage of change between values.
 */
const calculatePercentageChange = (
  currentValue,
  previousValue,
  precision = 1
) => {
  if (previousValue === 0) {
    throw new Error('Previous value cannot be zero.')
  }

  const change = ((currentValue - previousValue) / previousValue) * 100

  return parseFloat(change.toFixed(precision))
}

const useRequire = path => {
  // eslint-disable-next-line no-undef
  return require(`../assets/${path}`)
}

export {
  convertToBoolean,
  textTransform,
  generateSecureRandomString,
  getFileSize,
  formatFileSize,
  getFile,
  isBlob,
  createHash,
  formatWithUnits,
  calculatePercentageChange,
  useRequire,
}
