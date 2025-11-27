import React from 'react'

import { MediaPreview } from '../../../../../components/CustomUI/MediaView'
import { extensionGroup } from '../../../../../utils/extensions'
import AudioPlayer from './AudioPlayer'
import ImageView from './ImageView'
import styles from './RenderFile.module.scss'
import VideoPlayer from './VideoPlayer'

export default function RenderFile({ value, contentType, messageType = '' }) {
  const { word, pdf, image, video, audio } = extensionGroup

  return (
    <div className={styles['render-file-container']}>
      <div className={styles.file_info}>
        {value && (pdf.includes(contentType) || word.includes(contentType)) && (
          <MediaPreview
            file={value}
            displayFooter={true}
            hideDropdown={true}
            className={styles['custom-view']}
            style={{
              width: '220px',
              height: '180px',
              backgroundSize: '220px',
            }}
          />
        )}

        {value && audio.includes(contentType) && (
          <AudioPlayer file={value} messageType={messageType} />
        )}

        {value && video.includes(contentType) && (
          <VideoPlayer file={value} messageType={messageType} />
        )}

        {value && image.includes(contentType) && <ImageView file={value} />}
      </div>
    </div>
  )
}
