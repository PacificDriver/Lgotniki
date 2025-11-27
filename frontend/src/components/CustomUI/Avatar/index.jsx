import React, { useState, useEffect, useRef } from 'react'

import avatar from '../../../assets/icons/avatar.png'
import avatarSquare from '../../../assets/icons/avatar-square.png'

import { MdOutlinePhotoCamera } from 'react-icons/md'

import styles from './Avatar.module.scss'

const colors = [
  { letters: 'RNXC', background: '#0153CC', color: '#fff' },
  { letters: 'BEMP', background: '#DD340A', color: '#fff' },
  { letters: 'ZDJH', background: '#FF9A1F', color: '#162949' },
  { letters: 'LTFI', background: '#1E2C47', color: '#fff' },
  { letters: 'VQGK', background: '#2385A5', color: '#162949' },
  { letters: 'WOAS', background: '#493A9E', color: '#fff' },
  { letters: 'UY', background: '#8DC43A', color: '#162949' },
]

const getColor = name => {
  const letter = name?.charAt(0)?.toUpperCase()
  const color = colors.find(({ letters }) => letters.includes(letter))
  return color
    ? { background: color.background, color: color.color }
    : { background: null, color: null }
}

const getInitials = name => {
  if (!name) return ''
  const names = name.split(' ')
  const initials =
    names[0].charAt(0).toUpperCase() + (names[1]?.charAt(0).toUpperCase() || '')
  return initials
}

const Avatar = ({
  src,
  name,
  size = 'default',
  status,
  borderColor,
  appearance = 'circle',
  selection,
  customWidth = null,
}) => {
  const [imageSrc, setImageSrc] = useState(src || '')
  const [useInitials, setUseInitials] = useState(!src && !!name)

  const avatarRef = useRef(null)

  useEffect(() => {
    if (avatarRef.current) {
      avatarRef.current.style.setProperty('--border-color-avatar', borderColor)
    }
  }, [borderColor])

  useEffect(() => {
    setImageSrc(src || '')
    setUseInitials(!src && !!name)
  }, [name, src])

  const handleFileSelection = file => {
    setImageSrc(URL.createObjectURL(file))
    setUseInitials(false)
  }

  const handleAvatarClick = () => {
    if (selection) {
      document.getElementById('uploadFile').click()
    }
  }

  return (
    <div
      className={`${styles['avatar-container']} ${!customWidth && styles[`avatar-container__${size}`]} ${styles[`avatar-container--${appearance}`]} ${selection ? 'u-pointer' : ''}`}
      ref={avatarRef}
      onClick={handleAvatarClick}
      style={{
        ...(customWidth && {
          minWidth: customWidth,
          width: customWidth,
          height: customWidth,
        }),
      }}
      key={name}
    >
      {!imageSrc && !name && (
        <img
          src={appearance === 'square' ? avatarSquare : avatar}
          alt="Avatar"
        />
      )}
      {imageSrc && <img src={imageSrc} alt={name} />}
      {useInitials && (
        <div
          className={`${styles['avatar-container__initials']} ${styles[`avatar-container__initials--${size}`]}`}
          style={{
            background: getColor(name).background,
            color: getColor(name).color,
          }}
        >
          <span>{getInitials(name)}</span>
        </div>
      )}
      {status && (
        <div
          className={`${styles['avatar-container__status']} ${styles[`avatar-container__status--${status}`]}`}
        />
      )}
      {selection && (
        <>
          <input
            type="file"
            id="uploadFile"
            onChange={e => handleFileSelection(e.target.files[0])}
            style={{ display: 'none' }}
          />
          <div className={styles['avatar-container__edit']}>
            <MdOutlinePhotoCamera />
          </div>
        </>
      )}
    </div>
  )
}

export default Avatar
