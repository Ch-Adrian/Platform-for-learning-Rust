import React from 'react'
import Button from 'react-bootstrap/esm/Button';
import '../ModalStyle.css';

const ConfirmActionModal = ({open, handleCloseModal, handleConfirmAction, confirmationText}) => {
    if (!open) return null
    return (
        <div className='overlay'onClick={handleCloseModal}>
            <div className='modal-container modal-container-dialog' onClick={(e) => e.stopPropagation()}>
                <div className='text-container'>
                    <p>{confirmationText}</p>
                </div>
                <div className='modal-button-container'>
                    <Button variant='light' onClick={handleConfirmAction}>Tak</Button>
                    <Button variant='light' onClick={handleCloseModal}>Nie</Button>
                </div>
            </div>
        </div>
  )
}

export default ConfirmActionModal