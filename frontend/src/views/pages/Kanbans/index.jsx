import React, { useState, useEffect } from 'react'

import AppPage from '../../../components/CustomUI/AppPage'
import Kanban from '../../../components/CustomUI/Kanban'

import boardsMock from '../../../mocks/boards'

export default function Kanbans() {
  const [boards, setBoard] = useState([])

  const breadcrumbs = [{ label: 'Magnun', url: '' }, { label: 'Kanban' }]

  useEffect(() => {
    const storageBoard = JSON.parse(localStorage.getItem('boards'))

    if (!storageBoard?.length) {
      localStorage.setItem('boards', JSON.stringify(boardsMock))

      return setBoard(boardsMock)
    }

    setBoard(storageBoard)
  }, [])

  const handleOnDragged = ({ values }) => {
    localStorage.removeItem('boards')

    localStorage.setItem('boards', JSON.stringify(values))
  }

  return (
    <AppPage title="Kanban" breadcrumbs={breadcrumbs}>
      <Kanban items={boards} onDragged={values => handleOnDragged(values)} />
    </AppPage>
  )
}
