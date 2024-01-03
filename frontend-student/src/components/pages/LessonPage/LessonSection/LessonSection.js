import React, {useContext, useRef, useState} from 'react'
import TextCell from '../../../Cells/TextCell/TextCell'
import CodeCell from '../../../Cells/CodeCell/CodeCell'
import EmptyCell from '../../../Cells/EmptyCell/EmptyCell'
import "./LessonSection.css"
import AddCellButton from '../../../miscellaneous/AddButtons/AddCellButton/AddCellButton'
import UserType from '../../../../models/UserType'
import {BsTrash3} from 'react-icons/bs'
import { LessonContext } from '../../../../contexts/LessonContext/LessonContextProvider'
import { Draggable } from 'react-beautiful-dnd'
import StrictModeDroppable from '../../../miscellaneous/Droppable/StrictModeDroppable'
import {TbGridDots, TbArrowsMove } from 'react-icons/tb';
import MovableMenuContext from '../../../miscellaneous/MenuContext/Movable/MovableMenuContext'
import ImmutableCodeCell from '../../../Cells/ImmutableCodeCell/ImmutableCodeCell'
import Cell from '../../../Cells/Cell'
import QuizCell from '../../../Cells/QuizCell/QuizCell'
import ConfirmActionModal from '../../../Modals/ConfirmActionModal/ConfirmActionModal'

const SectionHeader = ({userType, page, sectionIdx}) => {
    const { getTitle, changeTitle } = useContext(LessonContext);
    const headerInput = useRef(null);

    const changeTitleHandler = (newTitle) =>{
        changeTitle(newTitle, page, sectionIdx);
    }

    const handleHeaderChange = (e) => {
        if (e.key === 'Enter'){
          headerInput.current.blur();
        }
    }

    return (
        <div className='header-name-container'>
            <div data-cy="section-name"
             ref={headerInput}
              contentEditable={userType === UserType.teacher} 
              className='section-header'
              onBlur={e => changeTitleHandler(e.currentTarget.textContent) } 
              onKeyDown={handleHeaderChange} 
              suppressContentEditableWarning={true} 
              spellCheck="false"
            //   style={userType!==UserType.teacher ? {display: 'block'} : {display: 'initial'}}
              > 
                {getTitle(page, sectionIdx)}
            </div>
        </div>
    );
}


const LessonSection = (props) => {
    const {removeSection } = useContext(LessonContext);
    const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);
    const [confirmActionModalConfig, setConfirmActionModalConfig] = useState({});

    const removeSectionHandler = () => {
        setConfirmActionModalOpen(false);
        removeSection(props.page, props.sectionIdx);
    }

    const openConfirmSectionDeletionModal = () => {
        setConfirmActionModalConfig({
          handleCloseModal: () => setConfirmActionModalOpen(false),
          handleConfirmAction: removeSectionHandler,
          confirmationText: "Czy na pewno chcesz usunąć tę sekcję?"
        })
        setConfirmActionModalOpen(true);
      }

    return (
        <div className='section-container' id={"section"+props.sectionIdx} data-cy="lesson-section" >
            <div className='section-header-container'>
              <SectionHeader userType={props.userType} page={props.page} sectionIdx={props.sectionIdx}/>
              <div className='section-misc-buttons-container'>
              </div>
            </div>
            <ConfirmActionModal open={confirmActionModalOpen} {...confirmActionModalConfig} />
            {props.userType === "STUDENT" && props.section?.cells.map((cell, idx) => {
                if (cell.type === "TextCell") {
                    return (
                        <Cell key={"cell" + idx + "text" + props.sectionIdx} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}>
                            <TextCell profileType={cell.profileType} key={idx} text={cell.value} cell={cell} cellIdx={idx} userType={props.userType}></TextCell>
                        </Cell>
                    )
                } else if (cell.type === "CodeCell") {
                    return (
                        <Cell key={"cell" + idx + "code" + props.sectionIdx} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}>
                            <CodeCell key={idx} profileType={cell.profileType} text={cell.value} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}></CodeCell>
                        </Cell>
                    )
                }  else if (cell.type === "ImmutableCodeCell") {
                    return (
                        <Cell key={"cell" + idx + "immutable-code" + props.sectionIdx} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}>
                            <ImmutableCodeCell profileType={cell.profileType} key={idx} text={cell.value} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}></ImmutableCodeCell>
                        </Cell>
                    )
                }  else if (cell.type === "QuizCell") {
                    return (
                        <Cell key={"cell" + idx + "quiz" + props.sectionIdx} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}>
                            <QuizCell key={idx} text={cell.value} content={cell.options} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType} sidebar={props.sidebar}></QuizCell>
                        </Cell>
                    )
                } else if (cell.type === "Empty") {
                    return (
                        <Cell key={"cell" + idx + "empty" + props.sectionIdx} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}>
                            <EmptyCell key={idx} profileType={cell.profileType} text={cell.value} cell={cell} cellIdx={idx} userType={props.userType}></EmptyCell>
                        </Cell>
                    )   
                }
                else
                    return null
            })}
        </div>
    )
}

export default LessonSection
