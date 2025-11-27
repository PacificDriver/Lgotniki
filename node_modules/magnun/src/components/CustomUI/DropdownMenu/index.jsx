import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useOutsideClick from '../../../hooks/useOutsideClick'

import { MdOutlineMoreHoriz, MdOutlineMoreVert } from 'react-icons/md'

import styles from './DropdownMenu.module.scss'

export default function DropdownMenu({
  options,
  onClicked,
  direction,
  className = '',
  horizontalIcon = false,
  dropdownMenuContentClass = '',
}) {
  const navigate = useNavigate()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const dropdownRef = useRef(null)
  const dropdownContentRef = useRef(null)
  const childRef = useRef(null)

  useEffect(() => {
    document
      .getElementById('default-main')
      ?.addEventListener('scroll', () => setDropdownOpen(false))

    return () => {
      document
        .getElementById('default-main')
        ?.removeEventListener('scroll', () => setDropdownOpen(false))
    }
  }, [])

  useOutsideClick(dropdownRef, () => {
    setDropdownOpen(false)
  })

  const handleToggleDropdown = event => {
    if (dropdownOpen) {
      return setDropdownOpen(false)
    }
    calculatePosition(event)
    setDropdownOpen(true)
  }

  const handleNavigateItem = (url, redirect = true) => {
    setDropdownOpen(false)

    if (redirect) navigate(url)
  }

  const calculatePosition = event => {
    if (dropdownRef.current && event) {
      const parentRect = event?.target?.getBoundingClientRect()
      const dropdownRect = dropdownContentRef.current.getBoundingClientRect()

      const spaceRight = window.innerWidth - parentRect.right
      const spaceAbove = parentRect.top
      const spaceBelow = window.innerHeight - parentRect.bottom

      let newPosition = {
        left:
          spaceRight >= dropdownRect.width
            ? parentRect.left
            : parentRect.right - (dropdownRect?.width || 160),
      }

      setTimeout(() => {
        const childHeight =
          childRef.current.getBoundingClientRect()?.height + 18

        if (spaceAbove < spaceBelow) {
          newPosition.top = parentRect.bottom + 10
        } else {
          newPosition.top = parentRect.top - childHeight
        }

        setPosition(newPosition)
      }, 1)
    }
  }

  return (
    <div className={styles['dropdown-menu-container']} ref={dropdownRef}>
      <div
        className={`${styles['dropdown-menu-container__header']} ${className}`}
        onClick={event => handleToggleDropdown(event)}
      >
        {horizontalIcon ? (
          <MdOutlineMoreHoriz className={styles['icon']} />
        ) : (
          <MdOutlineMoreVert className={styles['icon']} />
        )}
      </div>

      <div
        className={`${styles['dropdown-menu-container__content']} ${dropdownOpen && styles['dropdown-menu-container__content--visible']} ${direction === 'top' && styles['dropdown-menu-container__content--reverse']} ${dropdownMenuContentClass && dropdownMenuContentClass}`}
        ref={dropdownContentRef}
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        <ul ref={childRef}>
          {options?.map((option, index) => (
            <li
              className={`${styles['dropdown-menu-container__content__item']}`}
              key={index}
              onClick={() => {
                handleNavigateItem(option.to, option?.redirect)
                onClicked?.(option)
              }}
            >
              {option.icon && (
                <span
                  className={`${styles['dropdown-menu-container__content__item--icon']}`}
                >
                  {option.icon}
                </span>
              )}
              <span>{option.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
