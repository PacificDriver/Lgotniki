import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useDebounce from '../../../../hooks/useDebounce'

import Button from '../../../BaseUI/Button'
import Input from '../../../BaseUI/Input'
import { Modal, ModalBody } from '../../../BaseUI/Modal'

import { FiSearch } from 'react-icons/fi'

import data from './data'

import { translate } from '../../../../hooks/translate'
import styles from './SearchWrapper.module.scss'

export default function SearchWrapper({ isOpen = false, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const filterData = items => {
    return items.filter(item =>
      item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  }

  const filteredPages = debouncedSearchTerm ? filterData(data.pages) : []
  const filteredFiles = debouncedSearchTerm ? filterData(data.files) : []

  const handleItemClick = link => {
    onClose?.()
    navigate(link)
  }

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return text
    }

    const regex = new RegExp(`(${highlight})`, 'gi')

    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className={styles['result__item--highlight']}>
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  return (
    <div className={styles['search-wrapper']}>
      <Modal
        isOpen={isOpen}
        width="medium"
        className={styles['search-wrapper__modal-content']}
      >
        <ModalBody>
          <Input
            placeholder="Search itens..."
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            clickableIcon
            onFocused
            iconBefore={<FiSearch />}
            className={styles['search-wrapper__modal-content__custom-input']}
            iconClassName={styles['search-wrapper__modal-content__custom-icon']}
          />

          {debouncedSearchTerm && (
            <div className={styles['search-wrapper__results']}>
              <div className={styles['result']}>
                <span className={styles['result__category']}>Pages</span>

                {filteredPages.length > 0 ? (
                  filteredPages.map(page => (
                    <div
                      key={page.link}
                      className={styles['result__item']}
                      onClick={() => handleItemClick(page.link)}
                    >
                      <span>
                        {highlightText(page.name, debouncedSearchTerm)}
                      </span>
                      <span>{page.reference}</span>
                    </div>
                  ))
                ) : (
                  <div>No results found</div>
                )}
              </div>

              <div className={styles['result']}>
                <span className={styles['result__category']}>Files</span>

                {filteredFiles.length > 0 ? (
                  filteredFiles.map(file => (
                    <div
                      key={file.link}
                      className={styles['result__item']}
                      onClick={() => handleItemClick(file.link)}
                    >
                      {file.name}
                    </div>
                  ))
                ) : (
                  <div>No results found</div>
                )}
              </div>
            </div>
          )}

          {!filteredPages?.length && !filteredFiles?.length && !searchTerm && (
            <div className={styles['search-wrapper__empty']}>
              <span>{translate('UI.SEARCH_MSG')}</span>
            </div>
          )}

          <div className="w-100 d-flex align-items-center justify-content-end">
            <Button
              appearance="subtle"
              size="small"
              onClick={() => onClose?.()}
            >
              {translate('UI.CLOSE')}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}
