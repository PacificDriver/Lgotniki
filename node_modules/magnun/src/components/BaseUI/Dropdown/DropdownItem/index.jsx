import React from 'react'

export default function DropdownItem({ children, onClick }) {
  return (
    <li className="dropdown__item" onClick={onClick}>
      {children}
    </li>
  )
}
