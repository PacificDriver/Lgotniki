import React from 'react'

export default function ColorSchemeIcon({
  menu,
  sidebar,
  background,
  checked,
  onClick,
}) {
  return (
    <svg
      width="110"
      height="70"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <rect x="0" y="0" width="110" height="70" fill="#eef2f7" />
      <rect
        x="0"
        y="0"
        width="35"
        height="70"
        fill={sidebar || '#eef2f7'}
        stroke="#dee2e6"
        strokeWidth="1"
      />
      <rect x="35" y="0" width="75" height="18" fill={menu || '#eef2f7'} />
      <rect x="12" y="10" width="10" height="6" rx="2" ry="2" fill="#d0d0d0" />
      <rect x="12" y="25" width="10" height="6" rx="2" ry="2" fill="#d0d0d0" />
      <rect x="12" y="40" width="10" height="6" rx="2" ry="2" fill="#d0d0d0" />
      <rect x="12" y="55" width="10" height="6" rx="2" ry="2" fill="#d0d0d0" />
      <rect x="35" y="18" width="75" height="52" fill={background || '#fff'} />
      <line x1="35" y1="70" x2="110" y2="70" stroke="#d0d0d0" strokeWidth="1" />
      <line x1="35" y1="0" x2="110" y2="0" stroke="#d0d0d0" strokeWidth="1" />
      <line x1="110" y1="0" x2="110" y2="70" stroke="#d0d0d0" strokeWidth="1" />
      {checked && (
        <>
          <circle cx="95" cy="55" r="8" fill="#7b61ff" />
          <path
            d="M92 55 l2 2 l4 -4"
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
          />
        </>
      )}
    </svg>
  )
}
