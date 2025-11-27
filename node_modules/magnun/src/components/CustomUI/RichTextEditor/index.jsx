import React, { useState, useEffect } from 'react'
import { BlendEditor } from 'blend-editor'

import ButtonGroup from '../../../components/BaseUI/ButtonGroup'
import Button from '../../../components/BaseUI/Button'

import styles from './RichTextEditor.module.scss'

export default function RichTextEditor({
  content,
  placeholder,
  onSaved,
  focused,
  readOnly,
  maxHeight,
  useBorder,
  onBlur,
  onChange,
}) {
  const [editing, setEditing] = useState(false)
  const [onFocus, setOnFocus] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [value, setValue] = useState('')

  useEffect(() => {
    if (content) {
      setNewContent(content)
      setValue(content)
    }
  }, [content])

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.keyCode === 27) {
        setEditing(false)

        if (newContent?.length === content?.length) setNewContent(content || '')
      }
    }

    if (editing) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [editing])

  useEffect(() => {
    if (focused) {
      setOnFocus(focused)
      setEditing(true)
    }
  }, [focused])

  const handleEditing = () => {
    if (readOnly) return

    setEditing(true)
    setOnFocus(true)
  }

  const handleSave = () => {
    setOnFocus(false)
    setEditing(false)
    onSaved(newContent)
    setValue(newContent)
  }

  return (
    <div className={`${styles['rich-text-editor-container']}`}>
      {!editing ? (
        <div
          className={`${styles['rich-text-editor-container__reading']} ${readOnly && styles['rich-text-editor-container__reading--read-only']} ${useBorder && styles['rich-text-editor-container__reading--border']}`}
          onClick={handleEditing}
          style={{
            ...(maxHeight && { maxHeight: maxHeight }),
          }}
        >
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: newContent }}></div>
          ) : (
            placeholder
          )}
        </div>
      ) : (
        <div className="d-flex flex-column gap-1">
          <BlendEditor
            content={value}
            focused={onFocus}
            onChange={value => {
              setNewContent(value)
              onChange?.(value)
            }}
            onBlur={value => onBlur?.(value)}
          />

          {onSaved && (
            <ButtonGroup>
              <Button
                title="Salvar"
                appearance="primary"
                onClick={handleSave}
              />
              <Button
                title="Cancelar"
                appearance="soft"
                onClick={() => setEditing(false)}
              />
            </ButtonGroup>
          )}
        </div>
      )}
    </div>
  )
}
