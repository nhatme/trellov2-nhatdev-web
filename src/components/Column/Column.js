import React, { useEffect, useRef, useState } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form, Button } from 'react-bootstrap'
import { cloneDeep } from 'lodash'
import './Column.scss'
import Card from 'components/Card/Card'
import { mapOrder } from 'utilities/sorts'
import ConfirmModal from 'components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { saveContentAfterPressEnter, selectAllinLineText } from 'utilities/contentEditable'


const Column = (props) => {

    const { column, onCardDrop, onUpdateColumn } = props
    const cards = mapOrder(column.cards, column.cardOrder, "id")

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

    const [columnTitle, setColumnTitle] = useState('')
    const handleColumnTitleChange = (e) => setColumnTitle(e.target.value)

    const [openNewCardForm, setOpeNewCardForm] = useState(false)
    const toggleOpenNewCardForm = () => { setOpeNewCardForm(!openNewCardForm) }

    const newCardTextareaRef = useRef(null)

    const [newCardTitle, setNewCardTitle] = useState('')
    const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value)

    useEffect(() => {
        setColumnTitle(column.title)
    }, [column.title])

    useEffect(() => {
        if (newCardTextareaRef && newCardTextareaRef.current) {
            newCardTextareaRef.current.focus()
            newCardTextareaRef.current.select()
        }
    }, [openNewCardForm])

    const onConfirmModalAction = (type) => {
        console.log(type)
        if (type === MODAL_ACTION_CONFIRM) {
            const newColumn = {
                ...column,
                _destroy: true
            }
            onUpdateColumn(newColumn)
        }
        toggleShowConfirmModal()
    }

    const handleColumnTitleBlur = () => {
        console.log(columnTitle)
        const newColumn = {
            ...column,
            title: columnTitle
        }
        onUpdateColumn(newColumn)
    }

    const addNewCard = () => {
        if (!newCardTitle) {
            newCardTextareaRef.current.focus()
            return
        }

        const newCardToAdd = {
            id: Math.random().toString(36).substring(2, 5), // 5 random characters, will remove when we implement code api
            boardId: column.boardId,
            columnId: column.id,
            title: newCardTitle.trim(),
            cover: null
        }
        let newColumn = cloneDeep(column)
        newColumn.cards.push(newCardToAdd)
        newColumn.cardOrder.push(newCardToAdd.id)  
        
        onUpdateColumn(newColumn)
        setNewCardTitle('')
        toggleOpenNewCardForm()
    }

    return (
        <div className='column'>
            <header className='column-drag-handle'>
                <div className='column-title'>
                    <Form.Control
                        size='sm'
                        type='text'
                        className='trello-content-editable'
                        value={columnTitle}
                        onChange={handleColumnTitleChange}
                        onBlur={handleColumnTitleBlur}
                        onKeyDown={saveContentAfterPressEnter}
                        onClick={selectAllinLineText}
                        onMouseDown={e => e.preventDefault()}
                        spellCheck="false"
                    // onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
                    />
                </div>
                <div className='column-dropdown-actions'>
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" size='sm' className='dropdown-btn' />

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={toggleOpenNewCardForm}>Add card...</Dropdown.Item>
                            <Dropdown.Item onClick={toggleShowConfirmModal} >Remove column...</Dropdown.Item>
                            <Dropdown.Item >Move all card in this column (beta)...</Dropdown.Item>
                            <Dropdown.Item >Archive all card in this column (beta)...</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

            </header>
            <div className='card-list'>
                <Container
                    orientation="vertical"
                    groupName="nhatdev-columns"
                    onDrop={dropResult => onCardDrop(column.id, dropResult)}
                    getChildPayload={index => cards[index]}
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'card-drop-preview'
                    }}
                    dropPlaceholderAnimationDuration={200}
                >
                    {cards.map((card, index) => (
                        <Draggable key={index}>
                            <Card card={card} />
                        </Draggable>
                    ))}

                </ Container >
                {openNewCardForm &&
                    <div className='add-new-card-area'>
                        <Form.Control
                            size='sm'
                            as='textarea'
                            rows='3'
                            placeholder='Enter a title for this card..'
                            className='textarea-enter-new-card'
                            ref={newCardTextareaRef}
                            value={newCardTitle}
                            onChange={onNewCardTitleChange}
                            onKeyDown={event => (event.key === 'Enter') && addNewCard()}
                            spellCheck='false'
                        />
                    </div>
                }
            </div>
            <footer>
                {openNewCardForm &&
                    <div className='add-new-card-actions'>
                        <Button variant="success" size='sm' onClick={addNewCard}>Add Card</Button>
                        <span className='cancel-icon' onClick={toggleOpenNewCardForm}>
                            <i className='fa fa-trash icon'></i>
                        </span>
                    </div>
                }
                {!openNewCardForm &&
                    <div className='footer-actions' onClick={toggleOpenNewCardForm}>
                        < i className='fa fa-plus icon' /> Add another card
                    </div>
                }

            </footer>
            <ConfirmModal
                show={showConfirmModal}
                onAction={onConfirmModalAction}
                title="Remove column"
                content={`Are you sure, you want to remove <strong> ${column.title}</strong>. </br> All related cards will also be removed!`} />
        </div>
    )
}

export default Column