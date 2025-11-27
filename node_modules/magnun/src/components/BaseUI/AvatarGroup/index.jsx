import React, { useEffect, useState } from 'react'

import { Dropdown, DropdownContent, DropdownItem } from '../../BaseUI/Dropdown'
import Avatar from '../../CustomUI/Avatar'

import styles from './AvatarGroup.module.scss'

export default function AvatarGroup({
  appearance,
  data,
  size,
  max,
  borderColor,
}) {
  const [visibleItems, setVisibleItems] = useState([])
  const [hiddenItems, setHiddenItems] = useState([])
  const [maximumDisplayed, setMaximumDisplayed] = useState(4)

  useEffect(() => {
    setMaximumDisplayed(
      appearance === 'grid' && !max
        ? 6
        : appearance !== 'grid' && !max
          ? 4
          : max
    )
  }, [appearance, max])

  useEffect(() => {
    if (data?.length) {
      const visible = data?.slice(0, maximumDisplayed)
      const hidden = data?.slice(visible?.length, data?.length)
      setVisibleItems([...visible])
      setHiddenItems([...hidden])
    }
  }, [data, max, maximumDisplayed])

  return (
    <div className={`${styles['avatar-group-container']}`}>
      <div
        className={`${styles['avatar-group-container__item']} ${styles[`appearance-${appearance || 'default'}`]}`}
      >
        {visibleItems?.map((item, index) => (
          <div
            key={index}
            className={`${styles['avatar-group-container__item--sup']}`}
          >
            <Avatar
              src={item.image}
              name={item.name}
              size={size || 'default'}
              borderColor={
                borderColor ? borderColor : appearance === 'grid' ? '' : '#fff'
              }
            />
          </div>
        ))}

        {hiddenItems.length > 0 && (
          <div
            className={styles['avatar-group-container__item']}
            onClick={event => event.stopPropagation()}
          >
            <Dropdown
              trigger={
                <div
                  className={`${styles['hidden-users']} ${styles[`hidden-users__${size || 'default'}`]}`}
                  style={{ borderColor: borderColor }}
                >
                  +{hiddenItems.length}
                </div>
              }
              placement="right"
              triggerClassName={styles['custom__dropdown']}
              hideDropdownIcon={true}
            >
              <DropdownContent
                className={styles['avatar-group-container__item--content']}
              >
                {hiddenItems.map((item, index) => (
                  <DropdownItem key={index}>
                    <Avatar src={item.image} name={item.name} size="small" />

                    <span style={{ fontSize: '13px', fontWeight: '400' }}>
                      {item.name}
                    </span>
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>
          </div>
        )}
      </div>
    </div>
  )
}
