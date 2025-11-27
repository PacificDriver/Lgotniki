import React, { useCallback, useState } from 'react'

import { translate } from '../../../hooks/translate'

import { MdOutlineCloudUpload, MdDelete } from 'react-icons/md'

import styles from './Dropzone.module.scss'

export default function Dropzone() {
  const [selectedFiles, setSelectedFiles] = useState([])

  const onDrop = useCallback(event => {
    event.preventDefault()

    let files = Array.from(event.dataTransfer.files)
    setSelectedFiles(prevFiles => [...prevFiles, ...files])
  }, [])

  const onFileChange = event => {
    let files = Array.from(event.target.files)
    setSelectedFiles(prevFiles => [...prevFiles, ...files])
  }

  const removeFile = index => {
    setSelectedFiles(prevFiles => prevFiles.filter((file, i) => i !== index))
  }

  return (
    <div className={styles['dropzone-container']}>
      <div
        className={styles['dropzone-container__draggable']}
        onDragOver={event => event.preventDefault()}
        onDrop={onDrop}
      >
        <MdOutlineCloudUpload
          className={styles['dropzone-container__draggable--icon']}
        />
        <p className={styles['dropzone-container__draggable--title']}>
          {translate('COMPONENTS.DRAG_AND_DROP')}
        </p>
        <p className={styles['dropzone-container__draggable--or']}>
          {translate('COMPONENTS.OR')}
        </p>
        <label className={styles['dropzone-container__draggable--browser']}>
          {translate('COMPONENTS.SELECT_THE_FILE')}
          <input
            type="file"
            onChange={onFileChange}
            style={{ display: 'none' }}
            multiple
          />
        </label>
      </div>

      <div className={styles['dropzone-container__files']}>
        {selectedFiles.map((file, index) => (
          <div
            key={index}
            className={styles['dropzone-container__files__file']}
          >
            <div className="d-flex align-items-center gap-1">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className={styles['dropzone-container__files__file--image']}
              />
              <span className={styles['dropzone-container__files__file--name']}>
                {file.name}
              </span>
            </div>

            <div
              onClick={() => removeFile(index)}
              className={styles['dropzone-container__files__file--button']}
            >
              <MdDelete />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
