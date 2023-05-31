import React, {useContext} from 'react'
import TextCell from '../../../Cells/TextCell/TextCell'
import CodeCell from '../../../Cells/CodeCell/CodeCell'
import EmptyCell from '../../../Cells/EmptyCell/EmptyCell'
import "./LessonSection.css"
import AddCellButton from '../../../miscellaneous/AddButtons/AddCellButton/AddCellButton'
import UserType from '../../../models/UserType'
import {BsTrash3} from 'react-icons/bs'
import { LessonContext } from '../../../../contexts/LessonContext/LessonContextProvider'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import StrictModeDroppable from '../../../miscellaneous/Droppable/StrictModeDroppable'

const LessonSection = (props) => {
    const {removeSection, lessonDefinition, updateLesson} = useContext(LessonContext);

    const removeSectionHandler = () => {
        removeSection(props.page, props.sectionIdx);
    }

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        let modifiedLesson = {...lessonDefinition};
        const [reorderedCell] = modifiedLesson.pages[props.page].sections[props.sectionIdx].cells.splice(result.source.index, 1);
        modifiedLesson.pages[props.page].sections[props.sectionIdx].cells.splice(result.destination.index, 0, reorderedCell);
        updateLesson(modifiedLesson)
    }

    return (
        <div className='section-container'>
            {props.userType === UserType.teacher && <button className='section-delete-button' onClick={removeSectionHandler}><BsTrash3/></button>}
            {props.userType === UserType.teacher && <AddCellButton key={"-1addcell" + props.sectionIdx} cellIdx={-1} currentPage={props.page} sectionIdx={props.sectionIdx} />}
            {props.userType === UserType.teacher && 
            <DragDropContext onDragEnd={handleOnDragEnd}>
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
                                        <Draggable key={idx} draggableId={""+idx} index={idx}>
                                            {(provided) => {
                                                // let cellToAdd = ;
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
            </DragDropContext>
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