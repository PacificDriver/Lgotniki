import React from 'react'

import styles from './TagText.module.scss'

export default function TagText({ children }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: children }}
      className={styles['tag-text-container']}
    ></div>
  )
}
