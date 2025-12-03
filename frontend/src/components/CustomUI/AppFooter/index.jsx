import React from 'react'
import moment from 'moment'

import styles from './AppFooter.module.scss'

export default function AppFooter() {
  return (
    <div className={`${styles['app-footer-container']}`}>
      <p className="size-14">
        {moment().year()} &copy; <span>ITS</span>
      </p>
    </div>
  )
}
