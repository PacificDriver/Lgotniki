import React, { useState, useEffect } from 'react'

import { FiChevronDown } from 'react-icons/fi'

import styles from './Accordion.module.scss'

export function Accordion({
  items,
  children,
  borderless,
  accordionClassName,
  accordionItemClassName,
  gap,
  defaultIndex,
}) {
  const [activeTab, setActiveTab] = useState(defaultIndex || null)

  useEffect(() => {
    if (defaultIndex !== undefined && defaultIndex !== null) {
      setActiveTab(defaultIndex)
    }
  }, [defaultIndex])

  const handleActivateTab = index => {
    setActiveTab(prevIndex => (prevIndex === index ? null : index))
  }

  return (
    <div
      className={`${styles['accordion-container']} ${!gap && styles['accordion-container--full']}`}
      style={{ ...(gap && { gap }) }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={`${styles['accordion']} ${borderless && styles['accordion--borderless']} ${accordionClassName}`}
        >
          <div
            className={`${styles['accordion__header']} ${activeTab === index && styles['active']} ${accordionItemClassName}`}
            onClick={() => handleActivateTab(index)}
          >
            <span>{item.title}</span>
            <FiChevronDown
              className={`${activeTab === index && styles['rotate']}`}
              style={{ fontSize: '18px' }}
            />
          </div>

          {activeTab === index && (
            <div
              className={`${styles['accordion__inner']} ${activeTab === index && styles['visible']}`}
            >
              <div className={styles['inner__content']}>
                {Array.isArray(children)
                  ? children[activeTab || index]
                  : children}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function AccordionItem({ children, className }) {
  return (
    <div className={`accordion-item-container ${className || ''}`}>
      {children}
    </div>
  )
}
