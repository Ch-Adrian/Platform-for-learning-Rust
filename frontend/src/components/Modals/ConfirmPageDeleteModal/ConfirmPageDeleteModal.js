import React from 'react'
import Button from 'react-bootstrap/esm/Button';
import '../ModalStyle.css';

const ConfirmPageDeleteModal = ({open, handleCloseModal, handleRemovePage}) => {
    if (!open) return null
    return (
        <div className='overlay'onClick={handleCloseModal}>
            <div className='modal-container modal-container-dialog' onClick={(e) => e.stopPropagation()}>
                <div className='text-container'>
                    <p>Czy na pewno chcesz usunąć stronę?</p>
                </div>
                <div className='modal-button-container'>
                    <Button variant='light' onClick={handleRemovePage}>Tak</Button>
                    <Button variant='light' onClick={handleCloseModal}>Nie</Button>
                </div>
            </div>
        </div>
  )
}

export default ConfirmPageDeleteModal