import React, { useEffect, useRef } from 'react'

import { MdClose } from 'react-icons/md'

import styles from './Modal.module.scss'

const ModalDialogContent = React.forwardRef(
  ({ children, width, onClose, scrollBehavior, className = '' }, ref) => {
    const childrenWithProps = React.Children.map(children, child => {
      if (child.type && child.type.name === 'ModalHeader') {
        return React.cloneElement(child, { onClose })
      }

      return child
    })

    return (
      <div
        ref={ref}
        className={`${className && className} ${styles['modal-content']} ${styles[`modal-content--${width || 'medium'}`]} ${styles[`modal-content--scroll-${scrollBehavior || ''}`]}`}
        onClick={e => e.stopPropagation()}
      >
        {childrenWithProps}
      </div>
    )
  }
)

ModalDialogContent.displayName = 'ModalDialogContent'

export const Modal = ({
  isOpen,
  width,
  scrollBehavior,
  onClose,
  children,
  className = '',
}) => {
  const modalRef = useRef(null)
  const modalContentRef = useRef(null)

  const handleBackdropClick = e => {
    // Close modal only if click is on the backdrop (modal-container), not on the content
    if (onClose && e.target === modalRef.current) {
      onClose()
    }
  }

  if (isOpen) {
    return (
      <div
        ref={modalRef}
        className={styles['modal-container']}
        onClick={handleBackdropClick}
      >
        <ModalDialogContent
          ref={modalContentRef}
          width={width}
          onClose={onClose}
          scrollBehavior={scrollBehavior}
          className={className}
        >
          {children}
        </ModalDialogContent>

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

export const ModalHeader = ({ children, onClose }) => {
  return (
    <div id="modal-header" className={`${styles['modal-content__header']}`}>
      <h4 className={`${styles['modal-content__header--title']}`}>
        {children}
      </h4>

      {onClose && (
        <span className={styles['modal-content__header--close']}>
          <MdClose onClick={onClose} />
        </span>
      )}
    </div>
  )
}

export const ModalBody = ({ children }) => {
  const modalBodyRef = useRef(null)

  useEffect(() => handleScroll(), [])

  const handleScroll = () => {
    const body = modalBodyRef.current

    if (body) {
      const { scrollTop, clientHeight, scrollHeight } = body

      if (!(scrollHeight > clientHeight)) return

      const footer = document.getElementById('footer-modal')
      const header = document.getElementById('modal-header')

      if (scrollTop === 0) {
        footer?.classList?.add(`${styles['footer-modal--border-top']}`)
        header?.classList?.remove(
          `${styles['modal-content__header--border-bottom']}`
        )
      } else {
        header?.classList?.add(
          `${styles['modal-content__header--border-bottom']}`
        )
      }

      if (scrollTop > clientHeight) {
        footer?.classList?.remove(`${styles['footer-modal--border-top']}`)
      } else {
        footer?.classList?.add(`${styles['footer-modal--border-top']}`)
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

export const ModalFooter = ({ children }) => (
  <div id="footer-modal" className={`${styles['footer-modal']}`}>
    <div className={`${styles['footer-modal__buttons']}`}>{children}</div>
  </div>
)
