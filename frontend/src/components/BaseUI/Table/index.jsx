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

    // Temporarily override toLowerCase for table operations
    let isPatched = false
    const patchStringMethods = () => {
      if (!isPatched && wrapperRef.current) {
        // Patch the table's internal data access if possible
        // This is a workaround for powerful-react-table's internal search
        try {
          // Find and patch any search-related functions
          const root = wrapperRef.current
          const searchInputs = root.querySelectorAll('input[type="text"]')
          searchInputs.forEach(input => {
            const originalHandler = input.oninput
            input.oninput = e => {
              try {
                if (originalHandler) originalHandler.call(input, e)
              } catch (err) {
                console.warn('Search error handled:', err)
              }
            }
          })
        } catch (e) {
          // Silently fail if patching is not possible
        }
      }
    }

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

    // Add data-label attributes to table cells for mobile responsive design
    const addMobileLabels = () => {
      const root = wrapperRef.current
      if (!root) return

      try {
        const table = root.querySelector('table')
        if (!table) return

        const headerCells = table.querySelectorAll('thead th')
        const headers = Array.from(headerCells).map(
          th => th.textContent?.trim() || ''
        )

        const bodyCells = table.querySelectorAll('tbody td')
        bodyCells.forEach((cell, index) => {
          const colIndex = index % headers.length
          const label = headers[colIndex]

          if (label && !cell.hasAttribute('data-label')) {
            cell.setAttribute('data-label', label)
          }
        })
      } catch (e) {
        // Silently handle errors
      }
    }

    // Patch table cells to prevent null/undefined errors in search
    const patchTableCells = () => {
      const root = wrapperRef.current
      if (!root) return

      try {
        // Find all table cells and ensure they have valid text content
        const cells = root.querySelectorAll('td')
        cells.forEach(cell => {
          try {
            // Ensure cell has valid text content
            if (cell.textContent === null || cell.textContent === undefined) {
              if (cell.children.length === 0) {
                cell.textContent = ''
              }
            }
            // Also check child elements
            Array.from(cell.children).forEach(child => {
              if (
                child.textContent === null ||
                child.textContent === undefined
              ) {
                child.textContent = ''
              }
            })
          } catch (e) {
            // Silently handle errors
          }
        })
      } catch (e) {
        // Silently handle errors
      }
    }

    translate()
    patchTableCells()
    patchStringMethods()
    addMobileLabels()

    const observer = new MutationObserver(() => {
      translate()
      patchTableCells()
      patchStringMethods()
      addMobileLabels()
    })
    observer.observe(wrapperRef.current, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [props.columns])

  return (
    <div className="localized-table" ref={wrapperRef}>
      <CoreTable {...props} />
    </div>
  )
}

export { Table, Tr, Td }
export { default as ExpandableRow } from './ExpandableRow'
