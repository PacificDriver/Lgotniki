import React, { useState, useEffect, useRef } from 'react'
import { beneficiariesAPI } from '../../../services/api'
import Input from '../../BaseUI/Input'
import useDebounce from '../../../hooks/useDebounce'
import useOutsideClick from '../../../hooks/useOutsideClick'
import { FaTimes } from 'react-icons/fa'
import './BeneficiaryAutocomplete.scss'

export default function BeneficiaryAutocomplete({
  label,
  value = [],
  onChange,
  placeholder = 'Начните вводить фамилию...',
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([])
  const wrapperRef = useRef(null)
  const debouncedSearch = useDebounce(searchTerm, 300)
  const prevValueStringRef = useRef('')

  // Обновляем выбранных льготников при изменении value
  useEffect(() => {
    const valueIds = Array.isArray(value) ? value : []
    const valueIdsString = JSON.stringify([...valueIds].sort())

    // Сравниваем строковое представление массивов для определения изменений
    if (valueIdsString !== prevValueStringRef.current) {
      prevValueStringRef.current = valueIdsString

      if (valueIds.length === 0) {
        setSelectedBeneficiaries([])
      } else {
        // Загружаем данные выбранных льготников
        const loadSelected = async () => {
          try {
            setSelectedBeneficiaries(prev => {
              const loaded = []
              const idsToLoad = []

              // Проверяем, какие уже загружены
              valueIds.forEach(id => {
                const existing = prev.find(b => b.id === id)
                if (existing) {
                  loaded.push(existing)
                } else {
                  idsToLoad.push(id)
                }
              })

              // Загружаем недостающих
              if (idsToLoad.length > 0) {
                Promise.all(
                  idsToLoad.map(id =>
                    beneficiariesAPI
                      .get(id)
                      .then(beneficiary => beneficiary)
                      .catch(error => {
                        console.error(`Error loading beneficiary ${id}:`, error)
                        return null
                      })
                  )
                ).then(results => {
                  const validResults = results.filter(r => r !== null)
                  setSelectedBeneficiaries(prevState => {
                    const currentIds = prevState.map(b => b.id)
                    const newResults = validResults.filter(
                      r => !currentIds.includes(r.id)
                    )
                    return [...prevState, ...newResults]
                  })
                })
              }

              return loaded
            })
          } catch (error) {
            console.error('Error loading selected beneficiaries:', error)
          }
        }
        loadSelected()
      }
    }
  }, [value])

  // Поиск льготников при изменении текста
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length >= 2) {
      searchBeneficiaries(debouncedSearch)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [debouncedSearch])

  const searchBeneficiaries = async search => {
    try {
      setLoading(true)
      const response = await beneficiariesAPI.list({
        search,
        limit: 10,
        offset: 0,
      })
      const beneficiaries = response.beneficiaries || []

      // Фильтруем уже выбранных - используем value для проверки, чтобы избежать проблем с состоянием
      const selectedIds = Array.isArray(value) ? value : []
      const filtered = beneficiaries.filter(b => !selectedIds.includes(b.id))

      setResults(filtered)
      setIsOpen(filtered.length > 0)
    } catch (error) {
      console.error('Error searching beneficiaries:', error)
      setResults([])
      setIsOpen(false)
    } finally {
      setLoading(false)
    }
  }

  useOutsideClick(wrapperRef, () => {
    setIsOpen(false)
  })

  const handleInputChange = e => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    if (newValue.length >= 2) {
      setIsOpen(true)
    }
  }

  const handleSelectBeneficiary = beneficiary => {
    const newSelected = [...selectedBeneficiaries, beneficiary]
    setSelectedBeneficiaries(newSelected)
    setSearchTerm('')
    setIsOpen(false)

    // Вызываем onChange с массивом ID
    if (onChange) {
      onChange({
        target: {
          value: newSelected.map(b => b.id),
        },
      })
    }
  }

  const handleRemoveBeneficiary = (beneficiaryId, e) => {
    e?.stopPropagation()
    const newSelected = selectedBeneficiaries.filter(
      b => b.id !== beneficiaryId
    )
    setSelectedBeneficiaries(newSelected)

    if (onChange) {
      onChange({
        target: {
          value: newSelected.map(b => b.id),
        },
      })
    }
  }

  const handleInputFocus = () => {
    if (searchTerm.length >= 2 && results.length > 0) {
      setIsOpen(true)
    }
  }

  return (
    <div className="beneficiary-autocomplete" ref={wrapperRef}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '8px',
          }}
        >
          {label}
        </label>
      )}

      {/* Выбранные льготники */}
      {selectedBeneficiaries.length > 0 && (
        <div className="beneficiary-autocomplete__selected">
          {selectedBeneficiaries.map(beneficiary => (
            <div key={beneficiary.id} className="beneficiary-autocomplete__tag">
              <span>{beneficiary.fullName}</span>
              <FaTimes
                className="beneficiary-autocomplete__tag-remove"
                onClick={e => handleRemoveBeneficiary(beneficiary.id, e)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Поле ввода */}
      <div className="beneficiary-autocomplete__input-wrapper">
        <Input
          value={searchTerm}
          onChange={handleInputChange}
          onFocused={handleInputFocus}
          placeholder={placeholder}
          iconAfter={loading ? <span>...</span> : null}
        />

        {/* Выпадающий список результатов */}
        {isOpen && (
          <div className="beneficiary-autocomplete__dropdown">
            {loading ? (
              <div className="beneficiary-autocomplete__dropdown-item">
                Поиск...
              </div>
            ) : results.length > 0 ? (
              results.map(beneficiary => (
                <div
                  key={beneficiary.id}
                  className="beneficiary-autocomplete__dropdown-item"
                  onClick={() => handleSelectBeneficiary(beneficiary)}
                >
                  <div className="beneficiary-autocomplete__item-name">
                    {beneficiary.fullName}
                  </div>
                  {beneficiary.phone && (
                    <div className="beneficiary-autocomplete__item-detail">
                      {beneficiary.phone}
                    </div>
                  )}
                  {beneficiary.email && (
                    <div className="beneficiary-autocomplete__item-detail">
                      {beneficiary.email}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="beneficiary-autocomplete__dropdown-item">
                Льготники не найдены
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
        Если указаны конкретные льготники, другие фильтры будут игнорироваться.
        Оставьте пустым для использования фильтров выше.
      </div>
    </div>
  )
}
