import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { MdExpandMore, MdOutlineChevronRight } from 'react-icons/md'

import navigation from '../../../../config/navigation'

import styles from './Navigation.module.scss'

export default function Navigation(props) {
  const [height, setHeight] = useState('0px')
  const [navItems, setNavItems] = useState([])
  const [activeMenu, setActiveMenu] = useState('')

  const elementsRef = useRef([])
  const sidebarRef = useRef(null)

  useEffect(() => {
    navigation?.forEach(nav => {
      nav?.items?.forEach(menu => {
        menu.id = uuid()
        menu?.items?.forEach(subMenu => (subMenu.id = uuid()))
      })
    })

    setNavItems([...navigation])
  }, [])

  useEffect(() => {
    if (!props.toggledMenu && !props?.isMouseOver) {
      const menuItems = navigation
      menuItems.forEach(nav => {
        nav?.items?.forEach(item => {
          item.active = false

          item?.items?.forEach(subItem => {
            subItem.active = false
          })
        })
      })

      setHeight('0px')
      setNavItems([...menuItems])
    } else {
      hanldeAtiveItem()
    }
  }, [props.toggledMenu, props.isMouseOver])

  const collapseMenu = (id, active) => {
    if (!props?.toggledMenu && !props.isMouseOver) return

    const menuItems = navigation

    const updateItems = isActive => {
      menuItems.forEach(menu => {
        menu?.items?.forEach(item => {
          item.active = item?.id === id && isActive

          if (item.active && item?.items) {
            setTimeout(() => {
              setHeight(`${elementsRef.current[item?.label]?.scrollHeight}px`)
            }, 10)
          }

          item?.items?.forEach(subMenu => (subMenu.active = false))
        })
      })
      setNavItems([...menuItems])
    }

    if (activeMenu === id) {
      updateItems(active)
      if (!active) setHeight('0px')
      return
    }

    setActiveMenu(id)
    updateItems(true)
  }

  const collapseSubMenu = (id, event) => {
    event.stopPropagation()

    const menuItems = navigation

    menuItems.forEach(nav => {
      nav?.items?.forEach(item => {
        item?.items?.forEach(subItem => {
          subItem.active = false

          if (subItem?.id === id) {
            item.active = true
            subItem.active = true
          }
        })
      })
    })

    return setNavItems([...menuItems])
  }

  const hanldeAtiveItem = (path = null) => {
    const routeName = path || window.location.href.split('#')[1] || '/dashboard'
    const menuItems = navigation

    menuItems.forEach(nav => {
      nav?.items?.forEach(menu => {
        menu.active = false

        if (menu.label === routeName || menu.url === routeName) {
          menu.active = true
        }

        menu?.items?.forEach(subMenu => {
          subMenu.active = false

          if (subMenu?.url === routeName) {
            subMenu.active = true
            menu.active = true
          }
        })

        if (menu.active && menu?.items) {
          setActiveMenu(menu.id)

          setTimeout(() => {
            setHeight(
              `${elementsRef.current[`${menu?.label}`]?.scrollHeight}px`
            )
          }, 5)
        }
      })
    })

    return setNavItems([...menuItems])
  }

  return (
    <div className={`${styles['navigation-container']} pb-4`} ref={sidebarRef}>
      {navItems.map((nav, index) => (
        <div key={index}>
          {nav?.category && (
            <div className={styles['navigation-container__category']}>
              {!(props.toggledMenu || props.isMouseOver) ? '...' : nav.category}
            </div>
          )}

          {nav.items.map((itemMenu, indexMenu) => (
            <div key={indexMenu}>
              <ul
                className={`${styles['navigation-container__header']} ${itemMenu.active && `${styles['navigation-container__header--active']}`} ${!props.toggledMenu && !props.isMouseOver && `${styles['navigation-container__header--reset-justify']}`}`}
              >
                <li
                  className={styles['navigation-container__header__list']}
                  onClick={() => collapseMenu(itemMenu?.id, !itemMenu?.active)}
                >
                  <Link
                    to={itemMenu.url}
                    target={itemMenu?.target || '_self'}
                    onClick={props.onClose}
                  >
                    <div className="d-flex align-items-center justify-content-between gap-1">
                      <div className="d-flex align-items-center justify-content-between gap-1">
                        <span
                          className={
                            styles['navigation-container__header__list--icon']
                          }
                        >
                          {itemMenu.icon}
                        </span>

                        {(props.toggledMenu || props.isMouseOver) && (
                          <span
                            className={
                              styles[
                                'navigation-container__header__list--title'
                              ]
                            }
                            onClick={() =>
                              props.onClose({
                                hasChildrens: itemMenu?.items?.length > 0,
                              })
                            }
                          >
                            {itemMenu.name}
                          </span>
                        )}
                      </div>

                      {itemMenu?.items?.length &&
                        (props.toggledMenu || props.isMouseOver) && (
                          <span
                            className={
                              styles[
                                'navigation-container__header__list--expand'
                              ]
                            }
                          >
                            {itemMenu?.active ? (
                              <MdExpandMore />
                            ) : (
                              <MdOutlineChevronRight />
                            )}
                          </span>
                        )}
                    </div>
                  </Link>

                  {itemMenu?.items?.length && (
                    <div
                      className={`${styles['navigation-container__content']}`}
                      style={{
                        height: activeMenu === itemMenu?.id ? height : '0px',
                      }}
                    >
                      <ul
                        ref={el => (elementsRef.current[itemMenu.label] = el)}
                        className={styles['navigation-container__content__ul']}
                      >
                        {itemMenu?.items?.map((itemSubMenu, indexSubMenu) => (
                          <li
                            key={indexSubMenu}
                            className={`${styles['navigation-container__content__ul--li']} ${itemSubMenu.active && `${styles['navigation-container__content__ul--li--active']}`}`}
                            onClick={event =>
                              collapseSubMenu(itemSubMenu?.id, event)
                            }
                          >
                            <Link
                              to={itemSubMenu.url}
                              target={itemSubMenu?.target || '_self'}
                              onClick={props.onClose}
                            >
                              {itemSubMenu.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
