import React, { useEffect, useRef } from 'react'
import {
  PowerTable as CoreTable,
  Row as Tr,
  Cell as Td,
} from 'powerful-react-table'

import './TableOverrides.scss'

const LOCALIZED_TEXT = {
  noData: 'Данные не найдены',
  rowsPerPage: 'Строк на странице',
  of: 'из',
}

const Table = props => {
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!wrapperRef.current) return

    const translate = () => {
      const root = wrapperRef.current
      if (!root) return

      const noData = root.querySelector('.no__data')
      if (noData && noData.textContent !== LOCALIZED_TEXT.noData) {
        noData.textContent = LOCALIZED_TEXT.noData
      }

      const rowsLabel = root.querySelector('.quantity__label')
      if (rowsLabel && rowsLabel.textContent !== LOCALIZED_TEXT.rowsPerPage) {
        rowsLabel.textContent = LOCALIZED_TEXT.rowsPerPage
      }

      const totalWrapper = root.querySelector('.items__perpage span:last-child')
      if (totalWrapper) {
        const match = totalWrapper.textContent?.match(/\d+/)
        if (match) {
          const text = `${LOCALIZED_TEXT.of} ${match[0]}`
          if (totalWrapper.textContent !== text) {
            totalWrapper.textContent = text
          }
        }
      }
    }

    translate()
    const observer = new MutationObserver(() => translate())
    observer.observe(wrapperRef.current, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="localized-table" ref={wrapperRef}>
      <CoreTable {...props} />
    </div>
  )
}

export { Table, Tr, Td }
