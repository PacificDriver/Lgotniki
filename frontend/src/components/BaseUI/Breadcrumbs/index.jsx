import React, { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import './style.scss'

export default function Breadcrumbs({
  options,
  maxLabelLength,
  readOnly = false,
  separator,
}) {
  const navigate = useNavigate()

  const labelRef = useRef([])

  useEffect(() => isTheTextTruncated(), [labelRef])

  const handleNavigateItem = url => {
    if (!url || readOnly) return

    navigate(url)
  }

  const isTheTextTruncated = () => {
    setTimeout(() => {
      labelRef?.current?.forEach(ref => {
        if (!ref) return

        if (
          ref?.offsetWidth === 250 ||
          ref.innerText?.length > maxLabelLength
        ) {
          ref.title = ref?.dataset?.originalName || ref?.innerText
        }
      })
    }, 1000)
  }

  return (
    <div className="breadcrumb-container">
      <div
        className={`breadcrumb-container__content ${readOnly && 'breadcrumb-container__content--read-only'}`}
      >
        {options?.map((option, index) => {
          const isTruncated = option?.label?.length > maxLabelLength
          const lastItem = options?.length - 1 !== index

          return (
            <div
              key={index}
              className="breadcrumb-container__content__item"
              onClick={() => handleNavigateItem(option?.url)}
            >
              <span
                className={`${isTruncated ? 'breadcrumb-container__content__item--truncated-label' : 'breadcrumb-container__content__item--label'} ${!lastItem ? 'breadcrumb-container__content__item--last' : ''}`}
                ref={element => (labelRef.current[index] = element)}
                data-original-name={option?.label}
              >
                {isTruncated
                  ? option?.label?.substring(0, maxLabelLength) + '...'
                  : option?.label}
              </span>

              {lastItem && (
                <span className="breadcrumb-container__content__item--separator">
                  {separator || '/'}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
