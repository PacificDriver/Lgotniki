import { useCallback } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const useDownloadZip = () => {
  const downloadZip = useCallback(async folder => {
    const zip = new JSZip()

    const addFolderToZip = async (folder, parentPath = '') => {
      if (!folder) {
        console.warn('Folder is undefined')
        return
      }

      if (!folder.name) {
        console.warn('Folder name is undefined:', folder)
        return
      }

      const folderPath = `${parentPath}${folder.name}/`

      const currentFolder = zip.folder(folderPath)

      for (const file of folder.files || []) {
        if (file?.name) {
          let fileContent = file.content
          let fileName = file.name

          if (file.url) {
            try {
              const response = await fetch(file.url)
              const contentType = response.headers.get('content-type')
              fileContent = await response.blob()

              if (!fileName.includes('.')) {
                const extension = contentType?.split('/')[1]
                fileName += `.${extension}`
              }
            } catch (error) {
              console.error(
                `Erro ao buscar o arquivo na URL ${file.url}:`,
                error
              )
              continue
            }
          }

          currentFolder.file(fileName, fileContent)
        } else {
          console.warn('File name is missing:', file)
        }
      }

      for (const subfolder of folder.subfolders || []) {
        await addFolderToZip(subfolder, folderPath)
      }
    }

    await addFolderToZip(folder)

    const content = await zip.generateAsync({ type: 'blob' })

    saveAs(content, `${folder.name}.zip`)
  }, [])

  return { downloadZip }
}

export default useDownloadZip
