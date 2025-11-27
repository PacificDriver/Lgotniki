import React from 'react'

import styles from '../ListGroup.module.scss'

export default function ListItem({ children, className, active }) {
  return (
    <div
      className={`${styles['list-group-container__items__item__container']} ${className} ${active && `${styles['list-group-container__items__item__container--active']}`}`}
    >
      {children}
    </div>
  )
}
