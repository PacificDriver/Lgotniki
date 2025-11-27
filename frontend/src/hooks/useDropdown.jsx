import { useContext } from 'react'

import { DropdownContext } from '../contexts/dropdown'

export const useDropdown = () => {
  const { visible, setVisible, placement, trigger, parentRef } =
    useContext(DropdownContext)

  return { visible, setVisible, placement, trigger, parentRef }
}
