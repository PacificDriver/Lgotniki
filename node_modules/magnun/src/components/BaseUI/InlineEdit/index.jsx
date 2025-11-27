import React, { useState, useEffect, useRef } from 'react'

import useOutsideClick from '../../../hooks/useOutsideClick'

import { MdOutlineCheck } from 'react-icons/md'
import { MdOutlineClose } from 'react-icons/md'

import styles from './InlineEdit.module.scss'

export default function InlineEdit({
  value: propValue,
  onConfirm,
  customStyle,
  invalid,
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')
  const [currentValue, setCurrentValue] = useState('')

  const contentEditableRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    setValue(propValue)
  }, [propValue])

  useOutsideClick(contentRef, () => {
    setEditing(false)
    setValue(value)
  })

  const handleEditing = () => {
    setEditing(!editing)

    setTimeout(() => {
      contentEditableRef.current.focus()
    }, 0)
  }

  const handleSave = () => {
    setValue(currentValue)
    onConfirm?.(currentValue)
    setEditing(false)
  }

  const handleClose = () => {
    setValue(value)
    setEditing(false)
  }

  return (
    <div className={styles['inline-edit-container']}>
      {!editing ? (
        <div
          className={styles['inline-edit-container__reading']}
          onClick={handleEditing}
          style={customStyle}
        >
          {value}
        </div>
      ) : (
        <>
          <div ref={contentRef}>
            <div
              ref={contentEditableRef}
              contentEditable="true"
              className={`${styles['inline-edit-container__editing']} ${invalid ? styles['inline-edit-container__editing--invalid'] : ''}`}
              onInput={event => setCurrentValue(event.target.innerText)}
              suppressContentEditableWarning={true}
              style={customStyle}
            >
              {value}
            </div>

            <div className={styles['inline-edit-container__buttons']}>
              <div
                className={styles['inline-edit-container__buttons--button']}
                onClick={handleSave}
              >
                <MdOutlineCheck />
              </div>

              <div
                className={styles['inline-edit-container__buttons--button']}
                onClick={handleClose}
              >
                <MdOutlineClose />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
