import React, { useEffect, useRef } from 'react'

import useOutsideClick from '../../../hooks/useOutsideClick'

import { MdClose } from 'react-icons/md'

import styles from './Drawer.module.scss'

const DrawerContent = ({ children, onClose, scrollBehavior }) => {
  const modalContentRef = useRef(null)

  useOutsideClick(modalContentRef, () => onClose(true))

  const childrenWithProps = React.Children.map(children, child => {
    if (child.type && child.type.name === 'DrawerHeader') {
      return React.cloneElement(child, { onClose })
    }

    return child
  })

  return (
    <div
      ref={modalContentRef}
      className={`${styles['drawer-content']} ${styles[`drawer-content--scroll-${scrollBehavior || ''}`]}`}
    >
      {childrenWithProps}
    </div>
  )
}

export const Drawer = ({
  isOpen,
  placement,
  scrollBehavior,
  onClose,
  children,
}) => {
  const modalRef = useRef(null)

  if (isOpen) {
    return (
      <div
        ref={modalRef}
        className={`${styles['drawer-container']} ${styles[`drawer-container--${placement || 'right'}`]}`}
      >
        <DrawerContent onClose={onClose} scrollBehavior={scrollBehavior}>
          {children}
        </DrawerContent>

        {scrollBehavior === 'outside' && (
          <div
            style={{ position: 'absolute', width: '100%', marginTop: '100%' }}
          >
            {' '}
          </div>
        )}
      </div>
    )
  }

  return <></>
}

export const DrawerHeader = ({ children, onClose }) => {
  return (
    <div id="drawer-header" className={`${styles['drawer-content__header']}`}>
      <h4 className={`${styles['drawer-content__header--title']}`}>
        {children}
      </h4>

      {onClose && <MdClose />}
    </div>
  )
}

export const DrawerBody = ({ children }) => {
  const modalBodyRef = useRef(null)

  useEffect(() => handleScroll(), [])

  const handleScroll = () => {
    const body = modalBodyRef.current

    if (body) {
      const { scrollTop, clientHeight, scrollHeight } = body

      if (!(scrollHeight > clientHeight)) return

      const footer = document.getElementById('footer-drawer')
      const header = document.getElementById('drawer-header')

      if (scrollTop === 0) {
        footer?.classList?.add(`${styles['footer-drawer--border-top']}`)
        header?.classList?.remove(
          `${styles['drawer-content__header--border-bottom']}`
        )
      } else {
        header?.classList?.add(
          `${styles['drawer-content__header--border-bottom']}`
        )
      }

      if (scrollTop > clientHeight) {
        footer?.classList?.remove(`${styles['footer-drawer--border-top']}`)
      } else {
        footer?.classList?.add(`${styles['footer-drawer--border-top']}`)
      }
    }
  }

  return (
    <div
      ref={modalBodyRef}
      className={`${styles['body']}`}
      onScroll={handleScroll}
    >
      {children}
    </div>
  )
}

export const DrawerFooter = ({ children }) => (
  <div id="footer-drawer" className={`${styles['footer-drawer']}`}>
    <div className={`${styles['footer-drawer__buttons']}`}>{children}</div>
  </div>
)
