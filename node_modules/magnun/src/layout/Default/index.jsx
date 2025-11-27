import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { ThemeContext } from '../../contexts/theme'
import { useTheme } from '../../hooks/useTheme'

import AppContent from '../../components/CustomUI/AppContent'
import AppFooter from '../../components/CustomUI/AppFooter'
import AppHeader from '../../components/CustomUI/AppHeader'

import Sidebar from '../../components/CustomUI/Sidebar'

import config from '../../config/config'

import styles from './Default.module.scss'

const Default = () => {
  const { layout, rtl } = config

  const theme = useTheme()
  const { sidebarTheme, topMenuTheme } = useContext(ThemeContext)

  const [PageContentClass, setPageContentClass] = useState('')
  const [openMenu, setOpenMenu] = useState(!layout.sidebar.collapsed)
  const [openMenuMobile, setOpenMenuMobile] = useState(false)
  const [hideFooter, setHideFooter] = useState(false)
  const [displayMenuOptions, setDisplayMenuOptions] = useState(false)
  const [isSidebarRetracted, setIsSidebarRetracted] = useState(true)
  const [containerWidth, setContainerWidth] = useState(window.innerWidth)

  const containerRef = useRef(null)
  const sidebarRef = useRef(null)
  const paretSidebarRef = useRef(null)
  const overlayRef = useRef(null)

  const location = useLocation()

  useEffect(() => {
    window.addEventListener('resize', () =>
      setContainerWidth(window.innerWidth)
    )

    if (window.innerWidth > 992) {
      window.addEventListener('resize', () => setOpenMenuMobile(false))
    }
  }, [])

  useEffect(() => {
    if (!layout.sidebar.collapsed) {
      setIsSidebarRetracted(false)
      setDisplayMenuOptions(false)
    }
  }, [layout.sidebar.collapsed])

  useEffect(() => {
    const sidebar = sidebarRef?.current
    const overlay = overlayRef?.current

    if (openMenuMobile && window.innerWidth < 992) {
      paretSidebarRef.current.style.zIndex = 50
      sidebar.classList.add(`${styles['sidebar-sm-md']}`)
      overlay.classList.add(`${styles['overlay-container']}`)
    } else {
      paretSidebarRef.current.style.zIndex = 20
      sidebar.classList.remove(`${styles['sidebar-sm-md']}`)
      overlay.classList.remove(`${styles['overlay-container']}`)
    }
  }, [openMenuMobile])

  useEffect(() => {
    const routeName = location.pathname + location.hash

    if (
      (routeName.startsWith('/dashboard/emails') ||
        routeName.startsWith('/dashboard/chat')) &&
      window.innerWidth > 767.87
    ) {
      setHideFooter(true)
      setPageContentClass('page-content-container--reset-padding')
      setOpenMenu(false)
    } else {
      setHideFooter(false)
      setPageContentClass('')
      setOpenMenu(!layout.sidebar.collapsed)
    }

    if (
      (routeName.startsWith('/dashboard/emails') ||
        routeName.startsWith('/dashboard/chat')) &&
      window.innerWidth < 767.88
    ) {
      setPageContentClass('page-content-container--reset-padding-mobile')
      setHideFooter(true)
    }
  }, [location.pathname, location.hash])

  const onChildChanged = () => {
    setIsSidebarRetracted(false)
    setOpenMenu(!openMenu)
    setDisplayMenuOptions(false)
    setTimeout(() => setIsSidebarRetracted(true), 300)
  }

  const handleMouseOver = () => {
    if (!openMenu && isSidebarRetracted) {
      paretSidebarRef.current.classList.remove(styles['mobile-sidebar'])
      setDisplayMenuOptions(true)
    }
  }

  const handleMouseOut = () => {
    if (!openMenu && isSidebarRetracted) {
      paretSidebarRef.current.classList.add(styles['mobile-sidebar'])
      setDisplayMenuOptions(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`${styles['default-container']} ${styles[theme]}`}
      style={{ gridTemplateColumns: `${layout.sidebar.width}px 4fr` }}
      m-data-theme={theme} // eslint-disable-line react/no-unknown-property
      m-data-sidebar-theme={sidebarTheme} // eslint-disable-line react/no-unknown-property
      m-data-top-menu-theme={topMenuTheme} // eslint-disable-line react/no-unknown-property
    >
      <div
        ref={paretSidebarRef}
        className={`${styles['default-sidebar']} ${!openMenu && styles['mobile-sidebar']} ${styles[theme]}`}
        style={{ width: `${layout.sidebar.width}px` }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <Sidebar
          createRef={sidebarRef}
          toggledMenu={openMenu}
          menuMobile={openMenuMobile}
          className={openMenuMobile && 'sidebar-sm-md'}
          useBorderRight={hideFooter}
          isMouseOver={displayMenuOptions}
          onClose={({ hasChildrens }) =>
            setOpenMenuMobile(hasChildrens ? true : false)
          }
          toggleMenu={() => onChildChanged()}
        />
      </div>
      <div
        id="default-main"
        className={`${styles['default-main']}`}
        style={{
          marginLeft: !rtl
            ? containerWidth > 991
              ? openMenu
                ? `${layout.sidebar.width}px`
                : '70px'
              : '0px'
            : '0px',
          marginRight: rtl
            ? containerWidth > 991
              ? openMenu
                ? `${layout.sidebar.width}px`
                : '70px'
              : '0px'
            : '0px',
          width:
            containerWidth > 991
              ? openMenu
                ? `calc(100vw - ${layout.sidebar.width}px)`
                : 'calc(100vw - 80px)'
              : '100vw',
          maxWidth:
            containerWidth > 991
              ? openMenu
                ? `calc(100vw - ${layout.sidebar.width}px)`
                : 'calc(100vw - 80px)'
              : '100vw',
        }}
      >
        <div>
          {layout.header.visible && (
            <AppHeader
              toggleMenu={() => onChildChanged()}
              toggleMenuMobile={() => {
                setOpenMenuMobile(!openMenuMobile)
              }}
              useBorderBottom={hideFooter}
              toggledMenu={openMenu}
            />
          )}

          <AppContent className={PageContentClass} />
        </div>
        {(!hideFooter || layout.footer.visible) && (
          <div>
            <AppFooter />
          </div>
        )}
      </div>
      <div ref={overlayRef}></div>
    </div>
  )
}

export default Default
