import React, { useEffect, useState } from 'react'

import Navigation from './Navigation'

import itsLogo from '../../../assets/logos/its-logo.svg'

import { LuArrowLeftToLine, LuArrowRightToLine } from 'react-icons/lu'
import { MdClose } from 'react-icons/md'

import styles from './Sidebar.module.scss'

const Sidebar = ({
  toggledMenu,
  toggleMenu,
  menuMobile,
  onClose,
  className = '',
  useBorderRight = false,
  createRef,
  isMouseOver = false,
}) => {
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    setToggle(toggledMenu)
  }, [toggledMenu])

  const handleClickMenu = () => {
    toggleMenu?.()
    window.dispatchEvent(new Event('resize'))
  }

  return (
    <div
      className={`${styles['sidebar-container']} ${styles[className]} ${useBorderRight && styles['sidebar-container--border-right']}`}
      ref={createRef}
    >
      <div
        className={`${styles['sidebar-container__header']} ${!toggle && styles['sidebar-container__header--reset-justify']}`}
      >
        {!menuMobile && (
          <div className={styles['sidebar-container__header__logo']}>
            {toggle && (
              <img
                src={itsLogo}
                alt="ITS"
                width={64}
                className={styles['sidebar-container__header__logo--desktop']}
              />
            )}
            {!toggle && (
              <img
                src={itsLogo}
                alt="ITS"
                width={isMouseOver ? 64 : 32}
                className={styles['sidebar-container__header__logo--mobile']}
              />
            )}
          </div>
        )}

        {menuMobile && (
          <div className={styles['sidebar-container__header__mobile']}>
            <img src={itsLogo} width={64} alt="ITS" />

            <MdClose
              onClick={onClose}
              className={
                styles['sidebar-container__header__mobile--close-sidebar']
              }
            />
          </div>
        )}

        <button className={styles['menu-icon']} onClick={handleClickMenu}>
          {toggledMenu ? <LuArrowLeftToLine /> : <LuArrowRightToLine />}
        </button>
      </div>

      <div
        className={`${styles['sidebar-container__content']} ${styles['sidebar-container__content--scrollbar']}`}
      >
        <Navigation
          toggledMenu={toggledMenu}
          isMouseOver={isMouseOver}
          onClose={({ hasChildrens }) => onClose({ hasChildrens })}
        />
      </div>
    </div>
  )
}

export default Sidebar
