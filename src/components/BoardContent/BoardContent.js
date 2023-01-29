import React, { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import './BoardContent.scss'
import Column from 'components/Column/Column'
import { initialData } from 'actions/initialData'

const BoardContent = () => {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])

  useEffect(() => {
    const boardFromDB = initialData.boards.find(board => board.id === 'board-1')

    if (boardFromDB) {
      setBoard(boardFromDB)
      setColumns(boardFromDB.columns)
    }
  }, [])

  if (isEmpty(board)) {
    return <div className='not-found' style={{ 'padding': '10px', 'color': 'white' }}>Board Not Found!</div>
  }

  return (
    <div className='board-content'>
      {columns.map((column, index) => <Column key={index} Column={column} />)}
    </div>
  )
}

export default BoardContent