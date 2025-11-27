import React, { forwardRef, useEffect, useRef, useState } from 'react'
import {
  MdCheckCircle,
  MdClose,
  MdInfo,
  MdKeyboardArrowDown,
  MdReport,
  MdWarning,
} from 'react-icons/md'
import { convertToBoolean } from '../../../utils/utils'
import styles from './Toast.module.scss'

const typeOptions = {
  success: <MdCheckCircle />,
  warning: <MdWarning />,
  danger: <MdReport />,
  info: <MdInfo className={styles['info-icon']} />,
}

const Toast = ({
  title,
  description,
  appearance,
  icon,
  actions,
  isExpanded = false,
  ...props
}) => {
  const [displayContent, setDisplayContent] = useState(isExpanded)
  const toastRef = useRef(null)

  return (
    <div
      className={`${styles['toast-container__toast']} ${styles[appearance || 'default']}`}
      ref={toastRef}
      data-toast-expanded={displayContent?.toString()}
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-start">
          <span className={styles['toast-container__toast--icon-title']}>
            {icon ? icon : typeOptions[appearance] || typeOptions.info}
          </span>
          <span className={styles['toast-container__toast--title']}>
            {title}
          </span>
        </div>

        {!isExpanded && !props.onDismissed ? (
          <div
            className={`${styles['toast-container__toast--expand']}`}
            onClick={() => setDisplayContent(!displayContent)}
          >
            <MdKeyboardArrowDown
              className={
                displayContent ? styles['toast-container__toast--rotate'] : ''
              }
            />
          </div>
        ) : (
          props.firsToast && (
            <div
              className={`${styles['toast-container__toast--close']}`}
              onClick={props?.onDismissed}
            >
              <MdClose />
            </div>
          )
        )}
      </div>

      {(description || actions) && (
        <div
          className={`${styles['toast-content']} ${displayContent || props.onDismissed || isExpanded ? styles['toast-content--visible'] : ''}`}
        >
          {description && (
            <div className={styles['toast-content__description']}>
              {description}
            </div>
          )}
          <div
            className={styles['toast-content__buttons']}
            style={{
              marginLeft: ['default', 'link'].includes(appearance)
                ? '20px'
                : '33px',
            }}
          >
            {actions?.map((action, index) => (
              <div
                key={index}
                className={`${styles['toast-content__buttons--button']} ${styles[`toast-content__buttons--${appearance || 'default'}`]}`}
              >
                <div onClick={action?.onClick}>{action.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const ToastContainer = ({
  autoDismiss,
  onDismissed,
  children,
  isExpanded = false,
}) => {
  const toastContainerRef = useRef(null)

  const [containerHeight, setContainerHeight] = useState(65)
  const [totalChildren, setTotalChildren] = useState(0)
  const [toasts, setToasts] = useState([])
  const [timerId, setTimerId] = useState(null)

  useEffect(() => {
    setToasts(children)
    setTotalChildren(children?.length)
    setTimeout(() => applyHeight(), 0)
  }, [children])

  useEffect(() => {
    const clearTimer = () => clearTimeout(timerId)

    if (autoDismiss !== undefined && toasts.length > 0) {
      clearTimer()
      setTimerId(setTimeout(removeFirstToast, 8000))
    }
  }, [autoDismiss, toasts])

  const removeFirstToast = () => onDismissed()

  const handleClick = () => setTimeout(() => applyHeight(), 0)

  const applyHeight = () => {
    const container = toastContainerRef.current

    if (container) {
      const expanded = convertToBoolean(
        container?.firstElementChild?.firstElementChild?.getAttribute(
          'data-toast-expanded'
        )
      )

      if (onDismissed && container.firstElementChild) {
        toastContainerRef.current.firstElementChild.style.bottom = '0px'
        setContainerHeight(
          toastContainerRef?.current?.firstElementChild?.offsetHeight + 8
        )
        return
      }

      setContainerHeight(
        expanded ? container?.firstElementChild?.offsetHeight + 8 : 65
      )
    }
  }

  return (
    <div
      className={styles['toast-container']}
      ref={toastContainerRef}
      style={{
        height: containerHeight,
        ...(totalChildren === 0 && { display: 'none' }),
      }}
    >
      {React.Children.toArray(toasts)?.map((toast, index) => {
        const key = toast.key || index
        const childProps = onDismissed ? { onDismissed } : {}

        return (
          <Children
            key={key}
            index={index}
            onClick={handleClick}
            timerId={timerId}
            setTimerId={setTimerId}
            removeFirstToast={removeFirstToast}
            {...childProps}
            autoDismiss={autoDismiss}
            isExpanded={isExpanded}
          >
            {toast}
          </Children>
        )
      })}
    </div>
  )
}

const Children = forwardRef(
  (
    {
      children,
      onClick,
      timerId,
      removeFirstToast,
      setTimerId,
      onDismissed,
      autoDismiss,
      index,
    },
    ref
  ) => {
    const handleMouseEnter = () => {
      if (autoDismiss !== undefined) clearTimeout(timerId)
    }

    const handleMouseLeave = () => {
      if (autoDismiss !== undefined)
        setTimerId(setTimeout(removeFirstToast, 8000))
    }

    return (
      <div
        ref={ref}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={styles['children-container']}
      >
        {React.cloneElement(children, {
          onDismissed,
          autoDismiss,
          firsToast: index === 0,
        })}
      </div>
    )
  }
)

Children.displayName = 'Children'

export { Toast, ToastContainer }
