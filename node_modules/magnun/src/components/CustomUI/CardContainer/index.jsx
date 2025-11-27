import React, { useState } from 'react'

import { Dropdown, DropdownContent, DropdownItem } from '../../BaseUI/Dropdown'
import DropdownMenu from '../DropdownMenu'

import { MdExpandMore } from 'react-icons/md'

import styles from './CardContainer.module.scss'

export default function CardContainer({
  title,
  children,
  actions,
  filters,
  className,
  onFiltered,
}) {
  const [defaultFilter, setDefaultFilter] = useState(filters?.[0]?.label || '')

  return (
    <div className={styles['card-container']}>
      {(title || actions) && (
        <div className={styles['card-container__header']}>
          <div className={styles['card-container__header--title']}>{title}</div>
          <div className={styles['card-container__header--action']}>
            {actions?.length > 0 && <DropdownMenu options={actions} />}

            {filters?.length > 0 && (
              <Dropdown
                trigger={
                  <div className={styles['filter-dropdown']}>
                    <span>{defaultFilter}</span>
                    <MdExpandMore />
                  </div>
                }
                placement="right"
                hideDropdownIcon={true}
              >
                <DropdownContent>
                  {filters?.map(({ label, value }, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => {
                        onFiltered?.(value)
                        setDefaultFilter(label)
                      }}
                    >
                      {label}
                    </DropdownItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            )}
          </div>
        </div>
      )}
      <div className={`${styles['card-container__content']} ${className}`}>
        {children}
      </div>
    </div>
  )
}
