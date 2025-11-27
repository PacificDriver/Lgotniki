const useCreateFile = async item => {
  const response = await fetch(item.url)
  const data = await response.blob()

  return new File([data], item.name, { type: data?.type })
}

export default useCreateFile
