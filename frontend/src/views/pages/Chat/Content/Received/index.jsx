import React, { useEffect, useState } from 'react'

import { useChat } from '../../../../../hooks/useChat'
import { extensionGroup, extensions } from '../../../../../utils/extensions'
import { getFile } from '../../../../../utils/utils'

import Avatar from '../../../../../components/CustomUI/Avatar'
import RenderFile from '../RenderFile'

import styles from './Received.module.scss'

export default function Received({ values }) {
  const { currentChat } = useChat()

  const [classNames, setClassNames] = useState([])
  const [fileInfos, setFileInfos] = useState({}) // Armazena informações dos arquivos

  const { word, pdf, image, video, audio } = extensionGroup

  useEffect(() => {
    const fetchFileInfos = async () => {
      const fileInfoMap = {}
      const classNamesArray = await Promise.all(
        values.map(async value => {
          const fileInfo = await getFile(value.content)
          fileInfoMap[value.content] = fileInfo
          return determineClassName(fileInfo)
        })
      )

      setFileInfos(fileInfoMap)
      setClassNames(classNamesArray)
    }

    fetchFileInfos()
  }, [values])

  const determineClassName = fileInfo => {
    const contentType = fileInfo?.headers?.contentType
    const hasType =
      pdf.includes(contentType) ||
      word.includes(contentType) ||
      image.includes(contentType) ||
      video.includes(contentType)

    return hasType ? 'received-container__content__item--no-padding' : ''
  }

  const isSupportedFile = content => {
    const fileInfo = fileInfos[content]

    if (!fileInfo) return false

    const contentType = fileInfo?.headers?.contentType

    if (contentType) {
      return (
        pdf.includes(contentType) ||
        word.includes(contentType) ||
        image.includes(contentType) ||
        video.includes(contentType) ||
        audio.includes(contentType)
      )
    }

    const mimeType = content.split('.').pop()
    return Object.values(extensions).includes(mimeType)
  }

  const getTime = value => {
    const date = new Date(value)
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className={styles['received-container']}>
      <div className="d-flex align-items-end gap-1">
        <div className="d-flex align-items-end">
          <Avatar
            src={currentChat?.user.image}
            name={currentChat?.user?.name}
          />
        </div>

        <div className={styles['received-container__content']}>
          {values?.map((value, index) => (
            <div
              key={index}
              className={`${styles['received-container__content__item']} ${
                values?.length < 2 &&
                styles['received-container__content__item--unique']
              } ${styles[classNames[index]]}`}
              style={{
                ...(video.includes(
                  fileInfos[value.content]?.headers?.contentType
                ) ||
                image.includes(fileInfos[value.content]?.headers?.contentType)
                  ? { padding: 0, background: 'transparent' }
                  : {}),
              }}
            >
              {isSupportedFile(value?.content) ? (
                <div
                  className={styles['received-container__content__item__file']}
                >
                  <RenderFile
                    value={value.content}
                    contentType={
                      fileInfos[value?.content]?.headers?.contentType
                    }
                    messageType="received"
                  />
                </div>
              ) : (
                <div
                  className={
                    styles['received-container__content__item--message']
                  }
                >
                  {value.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles['received-container--hour']}>
        {getTime(values?.[0]?.createdAt)}
      </div>
    </div>
  )
}
