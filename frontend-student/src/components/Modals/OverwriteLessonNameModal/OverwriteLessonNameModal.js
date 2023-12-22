import React from 'react'
import Button from 'react-bootstrap/esm/Button';
import '../ModalStyle.css';

const OverwriteLessonNameModal = ({open, handleCloseModal, handleOverwriteLesson}) => {
    if (!open) return null
    return (
        <div className='overlay'onClick={handleCloseModal}>
            <div className='modal-container modal-container-dialog' onClick={(e) => e.stopPropagation()}>
                <div className='text-container'>
                    <p>Wpisana nazwa lekcji już istnieje. Czy chcesz nadpisać tę lekcję?</p>
                </div>
                <div className='modal-button-container'>
                    <Button variant='light' onClick={handleOverwriteLesson}>Tak</Button>
                    <Button variant='light' onClick={handleCloseModal}>Nie</Button>
                </div>
            </div>
        </div>
  )
}

export default OverwriteLessonNameModal