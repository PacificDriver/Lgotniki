import React from 'react'

import { useRequire } from '../../../../utils/utils'
import styles from '../Content/Content.module.scss'

export default function EmptyContent() {
  return (
    <div
      className={`${styles['content-container']} ${styles['content-container__empty']}`}
    >
      <img
        src={useRequire('svg/chat.svg')}
        alt="undraw-chat"
        className={styles['content-container__empty__image']}
      />
    </div>
  )
}
