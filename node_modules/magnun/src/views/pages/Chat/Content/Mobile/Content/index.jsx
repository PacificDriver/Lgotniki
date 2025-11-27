import React from 'react'

import Web from '../../Web'

import styles from './Content.module.scss'

export default function Content() {
  return (
    <div className={styles['content']}>
      <Web showIconBack showIconInfo className={styles['content__custom']} />
    </div>
  )
}
