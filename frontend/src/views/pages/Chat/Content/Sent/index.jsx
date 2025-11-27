import React, { useEffect, useState } from 'react'

import { extensionGroup, extensions } from '../../../../../utils/extensions'
import { getFile } from '../../../../../utils/utils'

import Avatar from '../../../../../components/CustomUI/Avatar'
import RenderFile from '../RenderFile'

import userImage from '../../../../../assets/users/carolina.avif'

import styles from './Sent.module.scss'

export default function Sent({ values }) {
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

    return hasType ? 'sent-container__content__item--no-padding' : ''
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
    <div className={styles['sent-container']}>
      <div className="d-flex align-items-end justify-content-end gap-1">
        <div className={styles['sent-container__content']}>
          {values?.map((value, index) => (
            <div
              className={`${styles['sent-container__content__item']} ${values?.length < 2 && styles['sent-container__content__item--unique']} ${styles[classNames[index]]}`}
              style={{
                ...((video.includes(value?.type) ||
                  image.includes(value?.type)) && {
                  padding: 0,
                  background: 'transparent',
                }),
              }}
              key={index}
            >
              {isSupportedFile(value?.content) ? (
                <div style={{ position: 'relative' }}>
                  <RenderFile
                    value={value.content}
                    contentType={
                      fileInfos[value?.content]?.headers?.contentType
                    }
                    messageType="sent"
                  />
                </div>
              ) : (
                <div
                  className={styles['sent-container__content__item--message']}
                  dangerouslySetInnerHTML={{ __html: value.content }}
                />
              )}
            </div>
          ))}
        </div>

        <div className={`d-flex align-items-end`}>
          <Avatar src={userImage} name={'Carolina'} />
        </div>
      </div>

      <div className={styles['sent-container--hour']}>
        {getTime(values?.[0]?.createdAt)}
      </div>
    </div>
  )
}
