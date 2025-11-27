import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import navigation from '../../../config/navigation'

import { ThemeContext } from '../../../contexts/theme'
import useOutsideClick from '../../../hooks/useOutsideClick'

import UserDropdown from '../../CustomUI/UserDropdown'

import Languages from './Languages'
import Notifications from './Notifications'

import { FiMoon, FiSearch, FiSun } from 'react-icons/fi'
import { HiMenuAlt1 } from 'react-icons/hi'
import { MdOutlineLightMode } from 'react-icons/md'

import styles from './AppHeader.module.scss'
import Apps from './Apps'
import SearchWrapper from './SearchWrapper'

const AppHeader = ({ toggleMenu, toggleMenuMobile, useBorderBottom }) => {
  const [, setDisplayMobileSearch] = useState(false)
  const [, setBlockAction] = useState(false)
  const [, setBreadcrumbs] = useState([])
  const [modalOpen, setModalOpen] = useState(false)

  const { theme, setTheme } = useContext(ThemeContext)

  const searchRef = useRef(null)

  const location = useLocation()

  const notifications = [
    {
      user: 'Carolina Ferreira',
      subject: 'Generate Reactjs Hooks for Wix',
      date: '2023-10-14 10:15:21',
    },
    {
      user: 'Jennyfer Whatson',
      subject: 'You were mentioned in a Figma task',
      date: '2023-10-13 17:32:11',
    },
    {
      user: 'System',
      subject: 'The "Learn Git" project ends today',
      date: '2023-10-10 11:00:00',
    },
    {
      user: 'Laura Lima',
      subject:
        'Requested submission of attachments for the system redesign task',
      date: '2023-10-01 08:44:21',
    },
  ]

  useEffect(() => {
    const routeName = location.pathname + location.hash

    if (
      routeName.startsWith('/dashboard/emails') ||
      routeName.startsWith('/dashboard/chat')
    ) {
      setBlockAction(true)
      toggleMenu()
    } else {
      setBlockAction(false)
    }
  }, [location.pathname, location.hash])

  useOutsideClick(searchRef, () => {
    setDisplayMobileSearch(false)
  })

  useEffect(() => {
    const path = location.pathname
    const breadcrumbArray = findBreadcrumbs(path, navigation)
    setBreadcrumbs(breadcrumbArray)
  }, [location])

  const findBreadcrumbs = (path, navItems, parent = null) => {
    for (let navCategory of navItems) {
      for (let navItem of navCategory.items) {
        if (navItem.url === path) {
          const breadcrumbArray = []

          if (parent && parent.name !== 'Dashboards') {
            breadcrumbArray.push({ label: parent.name })
          }

          breadcrumbArray.push({ label: navItem.name })
          return breadcrumbArray
        }

        if (navItem.items) {
          const childBreadcrumbs = findBreadcrumbs(
            path,
            [{ items: navItem.items }],
            navItem
          )
          if (childBreadcrumbs.length > 0) {
            const breadcrumbArray = []

            if (parent && parent.name !== 'Dashboards') {
              breadcrumbArray.push({ label: parent.name })
            }

            return [...breadcrumbArray, ...childBreadcrumbs]
          }
        }
      }
    }

    return []
  }

  const handleClickMenuMobile = () => {
    toggleMenuMobile()
    window.dispatchEvent(new Event('resize'))
  }

  return (
    <>
      <div
        className={`${styles['header-container']} ${useBorderBottom && styles['header-container--border-bottom']}`}
      >
        <div className={styles['header-container__desktop']}>
          <div className="d-flex align-items-center justify-content-end ml-3">
            <div className={`${styles['header-container__desktop--options']}`}>
              <Languages />

              <div
                className={styles['action-icon']}
                onClick={() => setModalOpen(true)}
              >
                <FiSearch />
              </div>

              <Apps />

              <div
                className={styles['action-icon']}
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? <FiMoon /> : <FiSun />}
              </div>

              <Notifications values={notifications} />
              <UserDropdown />
            </div>
          </div>
        </div>

        <div className={styles['header-container__mobile']}>
          <div className="d-flex align-items-center justify-content-between">
            <HiMenuAlt1
              className={styles['header-container__mobile--icon']}
              onClick={handleClickMenuMobile}
            />

            <div className={styles['header-mobile']}>
              <div className={styles['header-mobile__items']}>
                <Languages />

                <div className="d-flex" ref={searchRef}>
                  <FiSearch
                    onClick={() => setModalOpen(true)}
                    className={styles['header-mobile__items--icon']}
                  />
                </div>

                <Apps />

                <div
                  className="u-pointer d-flex align-items-center"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                >
                  {theme === 'light' && <FiMoon />}
                  {theme === 'dark' && <MdOutlineLightMode />}
                </div>

                <Notifications values={notifications} />
                <UserDropdown hideName={true} size="2rem" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SearchWrapper isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

export default AppHeader
