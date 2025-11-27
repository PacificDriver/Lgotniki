import React, { useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

import DropdownProvider from '../../../contexts/dropdown'
import { useDropdown } from '../../../hooks/useDropdown'
import useOutsideClick from '../../../hooks/useOutsideClick'

import { MdKeyboardArrowDown } from 'react-icons/md'

import FloatWindow from '../../CustomUI/FloatWindow'
import styles from './Dropdown.module.scss'

export const Dropdown = ({
  children,
  placement,
  trigger,
  triggerClassName,
  hideDropdownIcon,
}) => {
  const parentRef = useRef(uuidv4())

  return (
    <div className={`${styles['dropdown-container']}`} ref={parentRef}>
      <DropdownProvider
        placement={placement}
        trigger={trigger}
        parentRef={parentRef}
      >
        <DropdownTitle
          className={triggerClassName}
          hideIcon={hideDropdownIcon}
        />

        {children}
      </DropdownProvider>
    </div>
  )
}

export const DropdownTitle = ({ className, hideIcon }) => {
  const { visible, setVisible, trigger } = useDropdown()

  return (
    <span
      className={`d-flex align-items-center gap-1 ${typeof trigger === 'string' || Object.prototype.hasOwnProperty.call(trigger?.type || {}, 'prototype') ? styles['dropdown-container__trigger'] : ''} ${className || ''}`}
      onClick={() => setVisible(!visible)}
    >
      {trigger}

      {!hideIcon && <MdKeyboardArrowDown />}
    </span>
  )
}

export const DropdownContent = ({ className, children }) => {
  const { visible, setVisible, parentRef, placement } = useDropdown()
  const contentRef = useRef(null)

  useOutsideClick(parentRef, () => setVisible(false), [contentRef])

  return (
    <>
      {visible && (
        <FloatWindow
          triggerRef={parentRef}
          className={className}
          placement={placement}
        >
          <div
            className={`${styles['dropdown-container__content']} ${className !== undefined && className}`}
            ref={contentRef}
          >
            <ul className={`${styles.content__list}`}>{children}</ul>
          </div>
        </FloatWindow>
      )}
    </>
  )
}

export const DropdownItem = ({ children, onClick, className = '' }) => {
  const { setVisible } = useDropdown()
  return (
    <div
      className={`${styles.dropdown__item} ${className !== undefined && className}`}
      onClick={event => {
        onClick?.(event)
        setVisible(false)
      }}
    >
      {children}
    </div>
  )
}
