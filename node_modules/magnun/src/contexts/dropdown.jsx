import React, { createContext, useState } from 'react'

export const DropdownContext = createContext({})

const DropdownProvider = ({ children, placement, trigger, parentRef }) => {
  const [visible, setVisible] = useState(false)

  return (
    <DropdownContext.Provider
      value={{ visible, setVisible, placement, trigger, parentRef }}
    >
      {children}
    </DropdownContext.Provider>
  )
}

export default DropdownProvider
