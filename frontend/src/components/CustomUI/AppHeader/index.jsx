import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import UserDropdown from '../../CustomUI/UserDropdown'

import { HiMenuAlt1 } from 'react-icons/hi'

import styles from './AppHeader.module.scss'

const AppHeader = ({ toggleMenu, toggleMenuMobile, useBorderBottom }) => {
  const location = useLocation()

  useEffect(() => {
    const routeName = location.pathname + location.hash

    if (
      routeName.startsWith('/dashboard/emails') ||
      routeName.startsWith('/dashboard/chat')
    ) {
      toggleMenu()
    }
  }, [location.pathname, location.hash])

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
                <UserDropdown hideName={true} size="2rem" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AppHeader
