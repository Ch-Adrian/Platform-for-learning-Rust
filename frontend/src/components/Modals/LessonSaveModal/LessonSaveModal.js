import React from 'react'
import Button from 'react-bootstrap/esm/Button';
import '../ModalStyle.css';
import './LessonSaveModal.css';

const LessonSaveModal = ({open, handleCloseModal, handleSaveLesson, handleExitLesson}) => {

    if (!open) return null
    return (
        <div className='overlay'onClick={handleCloseModal}>
            <div className='modal-container modal-container-savelesson' onClick={(e) => e.stopPropagation()}>
                <div className='text-container'>
                    <p>Czy chcesz zapisać obecną lekcję?</p>
                </div>
                <div className='button-container-savelesson'>
                    <Button variant='light' onClick={handleSaveLesson}>Tak</Button>
                    <Button variant='light' onClick={handleExitLesson}>Nie</Button>
                    <Button variant='light' onClick={handleCloseModal}>Anuluj</Button>
                </div>
            </div>
        </div>
  )
}

export default LessonSaveModal