import React from 'react'
import { translate } from '../../../hooks/translate'
import styles from './Comment.module.scss'
import Avatar from '../../CustomUI/Avatar'
import RenderHTML from '../../CustomUI/RenderHTML'

export const Comment = ({ avatar, author, time, content, actions }) => {
  const formatDate = date => {
    if (!time) return

    const newDate = new Date(date)
    const day =
      newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate()

    const abbreviatedMonths = [
      translate('ABBREVIATED_MONTHS.JANUARY'),
      translate('ABBREVIATED_MONTHS.FEBRUARY'),
      translate('ABBREVIATED_MONTHS.MARCH'),
      translate('ABBREVIATED_MONTHS.APRIL'),
      translate('ABBREVIATED_MONTHS.MAY'),
      translate('ABBREVIATED_MONTHS.JUNE'),
      translate('ABBREVIATED_MONTHS.JULY'),
      translate('ABBREVIATED_MONTHS.AUGUST'),
      translate('ABBREVIATED_MONTHS.SEPTEMBER'),
      translate('ABBREVIATED_MONTHS.OCTOBER'),
      translate('ABBREVIATED_MONTHS.NOVEMBER'),
      translate('ABBREVIATED_MONTHS.DECEMBER'),
    ]

    return `${abbreviatedMonths[newDate.getMonth()]} ${day}, ${newDate.getFullYear()}`
  }

  return (
    <div className={styles['comment-container']}>
      <div>
        <Avatar src={avatar} name={author} />
      </div>

      <div className={styles['comment-container__comment']}>
        <div className={styles['comment-container__comment__header']}>
          <span
            className={styles['comment-container__comment__header--author']}
          >
            {author}
          </span>
          <span className={styles['comment-container__comment__header--time']}>
            {formatDate(time)}
          </span>
        </div>

        <div className={styles['comment-container__comment__content']}>
          <RenderHTML>{content}</RenderHTML>
        </div>

        {actions && (
          <div className={styles['comment-container__comment__actions']}>
            {actions.map((action, index) => (
              <div key={index}>{action}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const CommentAction = ({ children }) => {
  return (
    <span className={styles['comment-container__comment__actions--action']}>
      {children}
    </span>
  )
}
