import React from 'react'

import styles from './ListGroup.module.scss'

export default function ListGroup(props) {
  const { borderless, children } = props

  return (
    <div className={styles['list-group-container']}>
      <div
        className={`${styles['list-group-container__items']} ${borderless && `${styles['list-group-container__items--borderless']}`}`}
      >
        <div className={`${styles['list-group-container__items__item']}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
