import React, {useContext, useRef} from 'react'
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
        <div>
            <div data-cy="section-name"
             ref={headerInput}
              contentEditable={userType === UserType.teacher} 
              className='section-header' 
              onBlur={e => changeTitleHandler(e.currentTarget.textContent) } 
              onKeyDown={handleHeaderChange} 
              suppressContentEditableWarning={true} 
              spellCheck="false"> 
                {getTitle(page, sectionIdx)}
            </div>
        </div>
    );
}


const LessonSection = (props) => {
    const {removeSection } = useContext(LessonContext);

    const removeSectionHandler = () => {
        removeSection(props.page, props.sectionIdx);
    }

    return (
        <div className='section-container' id={"section"+props.sectionIdx} data-cy="lesson-section" >
            <div className='section-header-container'>
              <SectionHeader userType={props.userType} page={props.page} sectionIdx={props.sectionIdx}/>
              <div className='section-misc-buttons-container'>
                  {props.userType === UserType.teacher && <div data-cy="section-drag" className='section-grab' {...props.handleDrag} ><TbGridDots/></div>}
                  {props.userType === UserType.teacher && <button data-cy="section-delete-button" className='section-delete-button' onClick={removeSectionHandler}><BsTrash3/></button>}
                  {props.userType === UserType.teacher && <div ><MovableMenuContext pageID={props.page} sectionID={props.sectionIdx} ><TbArrowsMove /></MovableMenuContext></div> }
              </div>
            </div>
            {props.userType === UserType.teacher && <AddCellButton key={"-1addcell" + props.sectionIdx} cellIdx={-1} currentPage={props.page} sectionIdx={props.sectionIdx} />}
            {props.userType === UserType.teacher && 
                <StrictModeDroppable droppableId={'section'+props.sectionIdx}>
                    {(provided) => {
                        return (<div className='cell-list-container' {...provided.droppableProps} ref={provided.innerRef}>
                            {props.section?.cells.map((cell, idx) => {
                                let cellToAdd
                                if (cell.type === "TextCell") {
                                    cellToAdd =
                                        (
                                            <Cell key={"cell" + idx + "text" + props.sectionIdx} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}>
                                                <TextCell key={idx + "text" + props.sectionIdx} profileType={cell.profileType} text={cell.value} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}></TextCell>
                                            </Cell>
                                        )
                                } else if (cell.type === "CodeCell") {
                                    cellToAdd =
                                        (
                                            <Cell key={"cell" + idx + "code" + props.sectionIdx} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}>
                                                <CodeCell key={idx + "code" + props.sectionIdx} profileType={cell.profileType} text={cell.value} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}></CodeCell>
                                            </Cell>
                                        )
                                } else if (cell.type === "ImmutableCodeCell") {
                                    cellToAdd =
                                        (
                                            <Cell key={"cell" + idx + "immmutable-code" + props.sectionIdx} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}>
                                                <ImmutableCodeCell key={idx + "code" + props.sectionIdx} profileType={cell.profileType} text={cell.value} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}></ImmutableCodeCell>
                                            </Cell>
                                        )
                                } else if (cell.type === "quiz") {
                                    cellToAdd =
                                        (
                                            <QuizCell key={idx + "quiz" + props.sectionIdx} text={cell.text} content={cell.options} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}></QuizCell>
                                        )
                                } 
                                else if (cell.type === "Empty") {
                                    cellToAdd =
                                        (
                                            <Cell key={"cell" + idx + "empty" + props.sectionIdx} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}>
                                                <EmptyCell key={idx + "empty" + props.sectionIdx} profileType={cell.profileType} text={cell.value} cell={cell} cellIdx={idx} userType={props.userType}></EmptyCell>
                                            </Cell>
                                        )
                                }
                                if (cellToAdd) {
                                    return (
                                        <Draggable key={props.sectionIdx+"dragcell"+idx} draggableId={props.sectionIdx+"dragcell"+idx} index={idx}>
                                            {(provided) => {
                                                return (<div data-cy="draggable-cell" {...provided.draggableProps}  ref={provided.innerRef}>
                                                    {React.cloneElement(cellToAdd, {handleDrag: provided.dragHandleProps})}
                                                   <div {...provided.dragHandleProps}></div>
                                                    <AddCellButton key={idx + "addcell" + props.sectionIdx} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} />
                                                </div>)
                                            }}
                                        </Draggable>)
                                }
                                else
                                    return null
                            })}
                        {provided.placeholder}
                        </div>)
                    }}
                    
                </StrictModeDroppable>
            }
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
                }  else if (cell.type === "quiz") {
                    return (
                        <Cell key={"cell" + idx + "quiz" + props.sectionIdx} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}>
                            <QuizCell key={idx} text={cell.value} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}></QuizCell>
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
