import React, { useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import useOutsideClick from '../../../hooks/useOutsideClick'
import { convertToBoolean } from '../../../utils/utils'
import styles from './Select.module.scss'

import FloatWindow from '../../CustomUI/FloatWindow'
import Checkbox from '../Checkbox'

import { FaTimes } from 'react-icons/fa'
import { MdArrowDropDown } from 'react-icons/md'

const SelectedList = ({ items, unique, isWrapped, onRemove }) => {
  const [hiddenCount, setHiddenCount] = useState(0)

  const selectedRef = useRef(null)
  const resizeTimeoutRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      if (selectedRef.current?.offsetParent) {
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current)
        }
        resizeTimeoutRef.current = setTimeout(limitVisibleItems, 20)
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)

    const observeSelectedRef = () => {
      if (selectedRef.current?.offsetParent) {
        resizeObserver.observe(selectedRef.current?.offsetParent)
      }
    }

    observeSelectedRef()

    window.addEventListener('resize', handleResize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeoutRef.current)
    }
  }, [items])

  const limitVisibleItems = () => {
    setHiddenCount(prevCount => {
      const parentContainer = selectedRef.current.offsetParent
      const container = selectedRef.current

      if (container && parentContainer) {
        container.style.width = `${parentContainer?.offsetWidth}px`

        let totalWidth = 0

        const childNodes = Array.from(container?.childNodes)?.filter(
          child => !child?.innerText?.includes('+')
        )

        childNodes?.forEach(child => {
          if (!child?.originalWidth)
            child.originalWidth = child.offsetWidth + 20

          totalWidth += child?.originalWidth
        })

        if (!container?.totalWidth) container.totalWidth = totalWidth

        if (container?.totalWidth > parentContainer.offsetWidth + 10) {
          let remainingWidth = parentContainer.clientWidth - 50

          childNodes?.forEach(child => {
            if (remainingWidth >= child.originalWidth) {
              remainingWidth -= child.originalWidth
              child.style.display = 'block'
              child.hidden = false
            } else {
              child.style.display = 'none'
              child.hidden = true
            }
          })
        } else {
          childNodes?.forEach(child => {
            child.style.display = 'block'
            child.hidden = false
          })
        }

        return (
          items?.length - childNodes?.filter(child => !child?.hidden)?.length
        )
      }

      return prevCount
    })
  }

  return (
    <div
      className={`${styles['selected-list']} ${unique && styles['selected-list--unique']}`}
      style={{ padding: isWrapped ? '0 5px' : '5px 10px 5px 5px' }}
      ref={selectedRef}
    >
      {items?.map((current, index) => (
        <div key={index} className={styles['selected-list__selection']}>
          <div className="d-flex align-items-center">
            {current.label}

            {!unique && (
              <FaTimes
                className={styles['selected-list__selection--remove']}
                onClick={event => onRemove?.(event, current)}
              />
            )}
          </div>
        </div>
      ))}

      {hiddenCount > 0 && (
        <div className={styles['selected-list__selection']}>+{hiddenCount}</div>
      )}
    </div>
  )
}

const SelectedListLabel = ({ items, listLabel }) => (
  <>
    {items?.length > 0 && (
      <div className={`${styles['selected-list']} pl-1`}>
        <div
          className={styles['selected-list__selection']}
          style={{ marginTop: '5px' }}
        >
          {items?.length > 1 ? (
            <>
              {items?.length} {listLabel}
            </>
          ) : (
            <>{items[0]?.label}</>
          )}
        </div>
      </div>
    )}
  </>
)

const OptionItem = ({ option, unique, onClick }) => (
  <li onClick={onClick} className={styles['option-item']}>
    <div
      className={`${styles['option-item__item']} ${option.checked ? styles['option-item__item--checked'] : ''}`}
    >
      {!unique && <Checkbox isChecked={option.checked} size="small" />}
      <span className={styles['option-item__name']}>{option.label}</span>
    </div>
  </li>
)

const normalizeSelection = input => {
  if (Array.isArray(input)) {
    return input.filter(value => value !== undefined && value !== null)
  }

  if (input === undefined || input === null) {
    return []
  }

  return [input]
}

const Select = ({
  label,
  options,
  selected,
  onSelected,
  unique,
  valid,
  message,
  required,
  listLabel,
  disabled = false,
  value,
  onChange,
}) => {
  const [selectionOptions, setSelectionOptions] = useState([])
  const [currentSelection, setCurrentSelection] = useState([])
  const [onSelect, setOnSelect] = useState(false)
  const [isWrapped, setIsWrapped] = useState(false)
  const [state, setState] = useState({ valid: undefined })

  const selectRef = useRef(null)
  const selectedRef = useRef(null)
  const optionsRef = useRef(null)
  const searchRef = useRef(null)

  const toogleDropdownId = `toggle-dropdown-${uuidv4()}`

  const computedSelectedValues = useMemo(() => {
    if (selected !== undefined && selected !== null) {
      return normalizeSelection(selected)
    }

    if (value !== undefined && value !== null) {
      return normalizeSelection(value)
    }

    return []
  }, [selected, value])

  useEffect(() => {
    const sourceOptions = options || []
    const values = sourceOptions.map(option => {
      const isChecked = computedSelectedValues?.includes(option.value)
      return {
        ...option,
        ...(isChecked ? { checked: true } : { checked: false }),
      }
    })

    setCurrentSelection(
      values.filter(option => computedSelectedValues?.includes(option.value))
    )
    setSelectionOptions(values)
    setState({ valid: convertToBoolean(valid) })
  }, [options, computedSelectedValues, valid])

  useEffect(() => {
    const checkWrap = () => {
      if (selectedRef.current) {
        const items = selectedRef.current.children
        const lastItem = items[items.length - 1]
        const lastItemRect = lastItem?.getBoundingClientRect()
        setIsWrapped(lastItemRect?.top > 0)
      }
    }

    const handleResize = () => {
      checkWrap()
      changePosition()
    }

    checkWrap()
    changePosition()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [currentSelection])

  useOutsideClick(selectRef, () => setOnSelect(false), [optionsRef])

  const changePosition = () => {
    const optionsContainer = optionsRef?.current
    const offsetHeight = selectedRef?.current?.offsetHeight

    if (optionsContainer && offsetHeight > 45) {
      optionsContainer.style.bottom = `${offsetHeight + 5}px`
    }
  }

  const handleToggleDropdown = () => {
    if (!onSelect && !disabled) {
      setOnSelect(!onSelect)
      setTimeout(() => searchRef?.current?.focus(), 0)
    }

    setState({ valid: undefined })
  }

  const statusClass = () =>
    state?.valid !== undefined ? (state?.valid ? '--valid' : '--invalid') : ''

  const searchForOptions = value => {
    if (!value) {
      setSelectionOptions([...options])
      return
    }

    const values = options?.filter(option =>
      option?.label?.toLowerCase().includes(value.toLowerCase())
    )
    setSelectionOptions([...values])
  }

  const emitSelection = selection => {
    onSelected?.(selection)

    if (onChange) {
      let nextValue

      if (value !== undefined) {
        nextValue = Array.isArray(value)
          ? selection.map(item => item.value)
          : selection[0]?.value ?? ''
      } else if (selected !== undefined) {
        nextValue = unique
          ? selection[0]?.value ?? ''
          : selection.map(item => item.value)
      } else {
        nextValue = unique
          ? selection[0]?.value ?? ''
          : selection.map(item => item.value)
      }

      onChange({ target: { value: nextValue } })
    }
  }

  const optionSelected = option => {
    if (unique) {
      setCurrentSelection([option])
      emitSelection([option])
      setOnSelect(false)
      return
    }

    const optionAlreadyExists = currentSelection?.findIndex(
      current => current.value === option.value
    )

    const optionIndex = options?.findIndex(
      current => current.value === option.value
    )

    const items = selectionOptions

    items[optionIndex].checked = !options[optionIndex]?.checked

    setSelectionOptions([...items])

    if (optionAlreadyExists !== -1) {
      const values = currentSelection.filter((_, i) => i !== optionAlreadyExists)
      setCurrentSelection(values)
      emitSelection(values)
      return
    }

    const values = [...currentSelection, { ...option, checked: true }]

    setCurrentSelection([...values])
    emitSelection([...values])
  }

  const remove = (event, select) => {
    event?.stopPropagation()

    const values = currentSelection?.filter(
      current => current?.value !== select?.value
    )

    const optionIndex = options?.findIndex(
      option => option.value === select.value
    )

    options[optionIndex].checked = !options[optionIndex]?.checked

    setCurrentSelection([...values])
    emitSelection([...values])
  }

  return (
    <div className={`${styles['select-container']}`} ref={selectRef}>
      <label htmlFor={selectRef} className={styles['select-container__label']}>
        <span>{label}</span>
        {required && label && (
          <span className={styles['select-container__label--required']}>*</span>
        )}
      </label>

      <div
        className={`${styles['select-container__selected']} ${
          onSelect && styles['select-container__selected--active']
        } ${styles[`select-container__selected${statusClass()}`]} ${
          disabled && styles['select-container__selected--disabled']
        }`}
        onClick={handleToggleDropdown}
        id={toogleDropdownId}
      >
        <input
          type="text"
          className={styles['select-container__selected--search']}
          ref={searchRef}
          onChange={event => searchForOptions(event.target.value)}
          disabled={disabled}
        />

        <div>
          {!onSelect && (
            <>
              {!listLabel || listLabel === undefined ? (
                <SelectedList
                  items={currentSelection}
                  unique={unique}
                  isWrapped={isWrapped}
                  onRemove={(event, current) => remove(event, current)}
                />
              ) : (
                <SelectedListLabel
                  items={currentSelection}
                  listLabel={listLabel}
                />
              )}
            </>
          )}
        </div>

        <MdArrowDropDown
          className={`${styles['icon-select']} ${onSelect ? styles['icon-select--expanded'] : ''}`}
        />
      </div>

      {onSelect && (
        <FloatWindow triggerRef={selectRef}>
          <div>
            <ul
              className={`${styles['select-container__options']} ${!selectionOptions?.length && styles['select-container__options--no-data']}`}
              ref={optionsRef}
            >
              {selectionOptions?.map((option, index) => (
                <OptionItem
                  key={index}
                  option={option}
                  unique={unique}
                  onClick={() => optionSelected(option, index)}
                />
              ))}

              {!selectionOptions?.length && <span>Sem dados</span>}
            </ul>
          </div>
        </FloatWindow>
      )}

      {state?.valid !== undefined && (
        <span
          className={`select-container__message ${styles[`select-container__message${statusClass()}`]}`}
        >
          {message || (state?.valid ? 'Success' : 'Error Text')}
        </span>
      )}
    </div>
  )
}

export default Select
