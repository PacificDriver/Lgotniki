import React from 'react'

import { MdOutlineSearch } from 'react-icons/md'

import styles from './Search.module.scss'

export default function Search({ onSearch, height, className }) {
  return (
    <div className={`${styles['search-container']} ${className}`}>
      <input
        type="text"
        placeholder="Search for..."
        onChange={e => onSearch?.(e.target.value)}
        style={{ height: height || '45px' }}
        className={styles['search-container--input']}
      />
      <MdOutlineSearch className={styles['search-container--icon']} />
    </div>
  )
}
