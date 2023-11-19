import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button';
import '../ModalStyle.css'
import './ConfigModal.css'

const ConfigModal = ({open, configFileContent, handleCloseModal, handleSaveConfig}) => {
    const [configContent, setConfigContent] = useState(configFileContent);


    if (!open) return null
    return (
        <div className='overlay'onClick={handleCloseModal}>
            <div className='modal-container' onClick={(e) => e.stopPropagation()}>
                <textarea data-cy="config-textarea" value={configContent} onChange={(e) => setConfigContent(e.target.value)}/>
                <div className='button-container'>
                    <Button data-cy="config-save-button" variant='light' onClick={() => handleSaveConfig(configContent)}>Zapisz</Button>
                    <Button variant='light' onClick={handleCloseModal}>Anuluj</Button>
                </div>
            </div>
        </div>
    )
}

export default ConfigModal