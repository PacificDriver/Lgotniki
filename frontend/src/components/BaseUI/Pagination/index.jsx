import React, { useState, useEffect } from 'react'

import { MdOutlineSkipNext } from 'react-icons/md'
import { MdOutlineSkipPrevious } from 'react-icons/md'
import { MdNavigateBefore } from 'react-icons/md'
import { MdNavigateNext } from 'react-icons/md'

import styles from './Pagination.module.scss'

export default function Pagination({
  totalPerPage,
  onPageChange,
  totalItems,
  options,
  currentPage,
}) {
  const [paginationInfo, setPaginationInfo] = useState({
    itemsPerPage: 3,
    currentPage: 1,
    offset: 0,
  })

  const [config, setConfig] = useState({
    skipPrevious: true,
    previous: true,
    next: true,
    skipNext: true,
    selectQuantity: true,
    simpleCounting: false,
  })

  const itemOptionsPerPage = [
    { value: 10, name: '10' },
    { value: 15, name: '15' },
    { value: 20, name: '20' },
    { value: 25, name: '25' },
  ]

  useEffect(() => {
    onPageChange?.({ pagination: paginationInfo })
  }, [])

  useEffect(() => {
    setPaginationInfo({
      ...paginationInfo,
      itemsPerPage: totalPerPage,
      ...(currentPage && { currentPage }),
    })

    onPageChange?.({
      pagination: {
        ...paginationInfo,
        itemsPerPage: totalPerPage,
        ...(currentPage && { currentPage }),
      },
    })
  }, [currentPage, totalPerPage])

  useEffect(() => {
    setConfig({
      ...config,
      ...options,
    })
  }, [])

  const changeItemsPerPage = value => {
    const pagination = {
      ...paginationInfo,
      itemsPerPage: Number(value),
    }

    onPageChange?.({ pagination })
    setPaginationInfo({ ...pagination })
  }

  const previous = page => {
    const previousPage = page > 1 ? page - 1 : 1

    const pagination = {
      ...paginationInfo,
      currentPage: previousPage,
      offset: (previousPage - 1) * paginationInfo.itemsPerPage,
    }

    onPageChange?.({ pagination })
    setPaginationInfo({ ...pagination })
  }

  const next = page => {
    const nextPage =
      page * paginationInfo.itemsPerPage < totalItems ? page + 1 : 1

    const pagination = {
      ...paginationInfo,
      currentPage: nextPage,
      offset: (nextPage - 1) * paginationInfo.itemsPerPage,
    }

    onPageChange?.({ pagination })
    setPaginationInfo({ ...pagination })
  }

  const firstOffset = () => {
    const pagination = {
      ...paginationInfo,
      currentPage: 1,
      offset: 0,
    }

    onPageChange?.({ pagination })
    setPaginationInfo({ ...pagination })
  }

  const lastOffset = () => {
    const currentPage = Math.ceil(totalItems / paginationInfo.itemsPerPage)

    const pagination = {
      ...paginationInfo,
      currentPage,
      offset: (currentPage - 1) * paginationInfo.itemsPerPage,
    }

    onPageChange?.({ pagination })
    setPaginationInfo({ ...pagination })
  }

  return (
    <div className={styles['paginagion-container']}>
      <div className={styles['paginagion-container__controls']}>
        {config?.selectQuantity && (
          <>
            <div
              className={
                styles['paginagion-container__controls--selector-label']
              }
            >
              Exibindo por página
            </div>
            <div className={styles['paginagion-container__controls__selector']}>
              <select
                name="select-quantity"
                className={
                  styles['paginagion-container__controls__selector--select']
                }
                onChange={event => changeItemsPerPage(event.target.value)}
              >
                {itemOptionsPerPage.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className={styles['paginagion-container__controls--per-page']}>
          {!config?.simpleCounting ? (
            <>
              <span>
                {paginationInfo.currentPage === 1
                  ? totalItems > 0
                    ? 1
                    : 0
                  : paginationInfo.currentPage * paginationInfo.itemsPerPage -
                    paginationInfo.itemsPerPage +
                    1}
              </span>
              <span>-</span>
              <span>
                {paginationInfo.currentPage * paginationInfo.itemsPerPage >
                totalItems
                  ? totalItems
                  : paginationInfo.currentPage * paginationInfo.itemsPerPage}
              </span>
            </>
          ) : (
            <span>
              {paginationInfo.currentPage * paginationInfo.itemsPerPage >
              totalItems
                ? totalItems
                : paginationInfo.currentPage * paginationInfo.itemsPerPage}
            </span>
          )}
          <span> de {totalItems}</span>
        </div>

        <div className={styles['paginagion-container__controls__buttons']}>
          {config?.skipPrevious && (
            <div
              className={`${styles['paginagion-container__controls__buttons__button']} ${paginationInfo.currentPage === 1 && styles['paginagion-container__controls__buttons__button--disabled']}`}
              onClick={() => firstOffset()}
            >
              <MdOutlineSkipPrevious
                className={
                  styles[
                    'paginagion-container__controls__buttons__button--icon'
                  ]
                }
              />
            </div>
          )}

          {config?.previous && (
            <div
              className={`${styles['paginagion-container__controls__buttons__button']} ${paginationInfo.currentPage === 1 && styles['paginagion-container__controls__buttons__button--disabled']}`}
              onClick={() => previous(paginationInfo.currentPage)}
            >
              <MdNavigateBefore
                className={
                  styles[
                    'paginagion-container__controls__buttons__button--icon'
                  ]
                }
              />
            </div>
          )}

          {config?.next && (
            <div
              className={`${styles['paginagion-container__controls__buttons__button']} ${paginationInfo.currentPage * paginationInfo.itemsPerPage >= totalItems && styles['paginagion-container__controls__buttons__button--disabled']}`}
              onClick={() => next(paginationInfo.currentPage)}
            >
              <MdNavigateNext
                className={
                  styles[
                    'paginagion-container__controls__buttons__button--icon'
                  ]
                }
              />
            </div>
          )}

          {config?.skipNext && (
            <div
              className={`${styles['paginagion-container__controls__buttons__button']} ${paginationInfo.currentPage * paginationInfo.itemsPerPage >= totalItems && styles['paginagion-container__controls__buttons__button--disabled']}`}
              onClick={() => lastOffset()}
            >
              <MdOutlineSkipNext
                className={
                  styles[
                    'paginagion-container__controls__buttons__button--icon'
                  ]
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
