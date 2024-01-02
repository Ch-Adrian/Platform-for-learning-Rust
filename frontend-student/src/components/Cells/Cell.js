import React, {useContext, useState} from 'react'
import {BsTrash3} from 'react-icons/bs';
import {TbGridDots, TbArrowsMove } from 'react-icons/tb';
import UserType from '../../models/UserType';
import MovableMenuContext from '../miscellaneous/MenuContext/Movable/MovableMenuContext';
import { LessonContext } from '../../contexts/LessonContext/LessonContextProvider';
import "./Cell.css"
import ConfirmActionModal from '../Modals/ConfirmActionModal/ConfirmActionModal';

const Cell = (props) => {
    const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);
    const [confirmActionModalConfig, setConfirmActionModalConfig] = useState({});

    const openConfirmSectionDeletionModal = () => {
      setConfirmActionModalConfig({
        handleCloseModal: () => setConfirmActionModalOpen(false),
        handleConfirmAction: removeCellHandler,
        confirmationText: "Czy na pewno chcesz usunąć tę komórkę?"
      })
      setConfirmActionModalOpen(true);
    }


    const {removeCell} = useContext(LessonContext);

    const removeCellHandler = () => {
        removeCell(props.cellIdx, props.currentPage, props.sectionIdx);
        setConfirmActionModalOpen(false);
    }

    return (
    <div data-cy="cell" className={(props.userType === UserType.teacher ? 'cell-container' : null) + ' base-cell'}>
        <div className='cell-misc-buttons-container'>
          {props.userType === UserType.teacher && <div data-cy="cell-drag" className='cell-grab' {...props.handleDrag} ><TbGridDots/></div>}
          {props.userType === UserType.teacher && <button data-cy="cell-delete-button" className='cell-delete-button' onClick={props.cell.value.length > 0 ? openConfirmSectionDeletionModal : removeCellHandler}><BsTrash3/></button>}
          {props.userType === UserType.teacher && <div ><MovableMenuContext pageID={props.currentPage} sectionID={props.sectionIdx} cellID={props.cellIdx} ><TbArrowsMove /></MovableMenuContext></div> }
        </div>
        {props.children}
        <ConfirmActionModal open={confirmActionModalOpen} {...confirmActionModalConfig} />
    </div>
  )
}

export default Cell