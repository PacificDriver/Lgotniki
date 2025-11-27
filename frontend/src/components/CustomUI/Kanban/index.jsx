import { useState, useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'

import Boards from './Boards'

export default function Kanban({ items, onDragged }) {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(items)
  }, [items])

  const onDragEnd = result => {
    if (!result.destination) return
    const { source, destination } = result

    if (source.droppableId !== destination.droppableId) {
      const sourceColIndex = data.findIndex(e => e.id === source.droppableId)
      const destinationColIndex = data.findIndex(
        e => e.id === destination.droppableId
      )

      const sourceCol = data[sourceColIndex]
      const destinationCol = data[destinationColIndex]

      const sourceTask = [...sourceCol.items]
      const destinationTask = [...destinationCol.items]

      const [removed] = sourceTask.splice(source.index, 1)
      destinationTask.splice(destination.index, 0, removed)

      data[sourceColIndex].items = sourceTask
      data[destinationColIndex].items = destinationTask

      setData(data)

      onDragged?.({ values: data })
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Boards items={items} />
    </DragDropContext>
  )
}
