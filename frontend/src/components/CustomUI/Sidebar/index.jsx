import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../../contexts/theme'
import { useTheme } from '../../../hooks/useTheme'

import Navigation from './Navigation'

import logoLight from '../../../assets/logos/logo-1.png'
import logoDark from '../../../assets/logos/logo-2.png'
import logoMobileFullTheme from '../../../assets/logos/logo-3.png'

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
  const theme = useTheme()
  const [logo, setLogo] = useState(null)
  const [logoMobile, setLogoMobile] = useState(null)
  const [toggle, setToggle] = useState(false)

  const { sidebarTheme } = useContext(ThemeContext)

  useEffect(() => {
    setLogo(theme === 'dark' || sidebarTheme === 'dark' ? logoDark : logoLight)
    setLogoMobile(logoMobileFullTheme)
  }, [theme, sidebarTheme])

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
                src={logo}
                alt="Magnun"
                width={120}
                className={styles['sidebar-container__header__logo--desktop']}
              />
            )}
            {!toggle && (
              <img
                src={isMouseOver ? logo : logoMobile}
                alt="Magnun"
                width={isMouseOver ? 120 : 32}
                className={styles['sidebar-container__header__logo--mobile']}
              />
            )}
          </div>
        )}

        {menuMobile && (
          <div className={styles['sidebar-container__header__mobile']}>
            <img src={logo} width={120} alt="Magnun" />

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
