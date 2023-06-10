import React, {useContext} from 'react'
import TextCell from '../../../Cells/TextCell/TextCell'
import CodeCell from '../../../Cells/CodeCell/CodeCell'
import EmptyCell from '../../../Cells/EmptyCell/EmptyCell'
import "./LessonSection.css"
import AddCellButton from '../../../miscellaneous/AddButtons/AddCellButton/AddCellButton'
import UserType from '../../../models/UserType'
import {BsTrash3} from 'react-icons/bs'
import { LessonContext } from '../../../../contexts/LessonContext/LessonContextProvider'
import { Draggable } from 'react-beautiful-dnd'
import StrictModeDroppable from '../../../miscellaneous/Droppable/StrictModeDroppable'
import {TbGridDots, TbArrowsMove } from 'react-icons/tb';
import { useState } from 'react'
import MovableMenuContext from '../../../miscellaneous/MenuContext/Movable/MovableMenuContext'

function SectionHeader({title, page, sectionIdx}) {
    const { getTitle, changeTitle } = useContext(LessonContext);

    const changeTitleHandler = (newTitle) =>{
        changeTitle(newTitle, page, sectionIdx);
    }

    return (
        <div>
            <div contentEditable="true" className='section-header' onBlur={e => changeTitleHandler(e.currentTarget.textContent) } suppressContentEditableWarning={true}> 
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
        <div className='section-container' id={"section"+props.sectionIdx} >
            <SectionHeader title={props.section.title} page={props.page} sectionIdx={props.sectionIdx}/>
            <div className='section-misc-buttons-container'>
                {props.userType === UserType.teacher && <div className='section-grab' {...props.handleDrag} ><TbGridDots/></div>}
                {props.userType === UserType.teacher && <button className='section-delete-button' onClick={removeSectionHandler}><BsTrash3/></button>}
                {props.userType === UserType.teacher && <div ><MovableMenuContext pageID={props.page} sectionID={props.sectionIdx} ><TbArrowsMove /></MovableMenuContext></div> }
            </div>
            {props.userType === UserType.teacher && <AddCellButton key={"-1addcell" + props.sectionIdx} cellIdx={-1} currentPage={props.page} sectionIdx={props.sectionIdx} />}
            {props.userType === UserType.teacher && 
                <StrictModeDroppable droppableId={'section'+props.sectionIdx}>
                    {(provided) => {
                        return (<div className='cell-list-container' {...provided.droppableProps} ref={provided.innerRef}>
                            {props.section?.cells.map((cell, idx) => {
                                let cellToAdd
                                if (cell.type === "text") {
                                    cellToAdd =
                                        (
                                            <TextCell key={idx + "text" + props.sectionIdx} text={cell.value} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}></TextCell>
                                        )
                                } else if (cell.type === "code") {
                                    cellToAdd =
                                        (
                                            <CodeCell key={idx + "code" + props.sectionIdx} text={cell.value} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}></CodeCell>
                                        )
                                } else if (cell.type === "empty") {
                                    cellToAdd =
                                        (
                                            <EmptyCell key={idx + "empty" + props.sectionIdx} text={cell.value} cell={cell} cellIdx={idx} userType={props.userType}></EmptyCell>
                                        )
                                }
                                if (cellToAdd) {
                                    return (
                                        <Draggable key={props.sectionIdx+"dragcell"+idx} draggableId={props.sectionIdx+"dragcell"+idx} index={idx}>
                                            {(provided) => {
                                                return (<div {...provided.draggableProps}  ref={provided.innerRef}>
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
                if (cell.type === "text") {
                    return (
                        <TextCell key={idx} text={cell.value} cell={cell} cellIdx={idx} userType={props.userType}></TextCell>
                    )
                } else if (cell.type === "code") {
                    return (
                        <CodeCell key={idx} text={cell.value} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}></CodeCell>
                    )
                } else if (cell.type === "empty") {
                    return (
                        <EmptyCell key={idx} text={cell.value} cell={cell} cellIdx={idx} userType={props.userType}></EmptyCell>
                    )
                }
                else
                    return null
            })}
        </div>
    )
}

export default LessonSection
