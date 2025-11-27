import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from './Tabs.module.scss'

export const Tabs = ({ children, onChange, selected, id, className = '' }) => {
  const [activeTab, setActiveTab] = useState(0)
  const tabId = useRef(id || uuidv4())

  useEffect(() => {
    if (selected !== undefined) {
      setActiveTab(selected - 1)
    }
  }, [selected])

  useEffect(() => {
    if (onChange) {
      onChange(activeTab)
    }
  }, [activeTab, onChange])

  const handleClickTab = currentTab => {
    if (currentTab !== activeTab) {
      setActiveTab(currentTab)
    }
  }

  return (
    <div
      className={`${styles['tabs-container']} ${className !== undefined && className}`}
      id={tabId.current}
    >
      {React.Children.map(children, child => {
        if (child?.type?.displayName === 'TabList') {
          return React.cloneElement(child, {
            activeTab,
            onClickTab: handleClickTab,
          })
        }
        return null
      })}

      {React.Children.map(children, child => {
        if (child?.type?.displayName === 'TabPanel') {
          return React.cloneElement(child, { activeTab })
        }
        return null
      })}
    </div>
  )
}

export const TabList = ({ children, activeTab, onClickTab }) => {
  return (
    <div role="tablist" className={styles['tab-list']}>
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
          isActive: activeTab === index,
          onClick: () => onClickTab(index),
          index,
        })
      })}
    </div>
  )
}
TabList.displayName = 'TabList'

export const Tab = ({ children, isActive, onClick, index }) => {
  return (
    <div
      className={`${styles['tab-list__tab']} ${isActive && styles['tab-list__tab--active']}`}
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${index}`}
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
Tab.displayName = 'Tab'

export const TabPanel = ({ children, activeTab }) => {
  return (
    <div className={styles['panel-list']}>
      {React.Children.map(children, (child, index) => {
        // Renderizar apenas se o activeTab for igual ao index
        if (activeTab !== index) return null

        return (
          <div
            className={styles['tab-panel']}
            role="tabpanel"
            id={`panel-${index}`}
            aria-labelledby={`tab-${index}`}
          >
            {React.cloneElement(child, { index })}
          </div>
        )
      })}
    </div>
  )
}
TabPanel.displayName = 'TabPanel'

export const Panel = ({ children, style, className }) => {
  return (
    <div style={style} className={className}>
      {children}
    </div>
  )
}
Panel.displayName = 'Panel'
