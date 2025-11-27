const formatter = value => {
  if (isBlob(value)) {
    return URL.createObjectURL(value)
  }

  return value
}

const isBlob = value => {
  return value instanceof Blob
}

export default formatter
