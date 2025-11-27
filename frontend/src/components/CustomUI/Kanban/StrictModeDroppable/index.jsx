import React, { useState, useEffect } from 'react'
import { Droppable } from 'react-beautiful-dnd'

export default function StrictModeDroppable(props) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true))

    return () => {
      cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])

  if (!enabled) {
    return null
  }

  return <Droppable {...props}>{props.children}</Droppable>
}
