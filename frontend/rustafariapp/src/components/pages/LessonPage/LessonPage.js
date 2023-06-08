import React, { useContext, useState } from 'react'
import "./LessonPage.css"
import { useParams } from 'react-router-dom'
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import LessonSection from './LessonSection/LessonSection';
import currentUser from '../../miscellaneous/userConfig';
import UserType from '../../models/UserType';
import AddSectionButton from '../../miscellaneous/AddButtons/AddSectionButton/AddSectionButton';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import StrictModeDroppable from '../../miscellaneous/Droppable/StrictModeDroppable';


const LessonPage = () => {
    const [userType, setUserType] = useState(currentUser);
    const { page } = useParams();
    // const location = useLocation();
    const {lessonDefinition, updateLesson} = useContext(LessonContext);

    console.log(lessonDefinition);

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        let modifiedLesson = {...lessonDefinition};
        if (result.draggableId.includes("cell")){
            const srcSectionIdx = result.source.droppableId.split("section")[1]
            const destSectionIdx = result.destination.droppableId.split("section")[1]
            const [reorderedCell] = modifiedLesson.pages[page].sections[srcSectionIdx].cells.splice(result.source.index, 1);
            modifiedLesson.pages[page].sections[destSectionIdx].cells.splice(result.destination.index, 0, reorderedCell);
        } else {
            const [reorderedSection] = modifiedLesson.pages[page].sections.splice(result.source.index, 1);
            modifiedLesson.pages[page].sections.splice(result.destination.index, 0, reorderedSection);
        }
        updateLesson(modifiedLesson);
    }

    return (
        <div className='page-container'>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                {userType === UserType.teacher && <AddSectionButton key={"-1addSection"+page} sectionIdx={-1} page={page}/>}
                {userType === UserType.teacher && lessonDefinition && 
                <StrictModeDroppable droppableId={'page'+page} type="droppableItem">
                {(provided) => {
                    return (
                    <div className='section-list-container' {...provided.droppableProps} ref={provided.innerRef}>
                        {lessonDefinition.pages[page].sections.map((section, idx) => {
                        return (
                        <React.Fragment key={idx}>
                            <Draggable key={page+"dragSection"+idx} draggableId={page+"dragsection"+idx} index={idx}>
                                            {(provided) => {
                                                return (
                                                <div {...provided.draggableProps}  ref={provided.innerRef}>
                                                    <LessonSection key={idx} section={section} sectionIdx={idx} page={page} userType={userType} handleDrag={provided.dragHandleProps}></LessonSection>
                                                    <AddSectionButton key={idx+"addSection"+page} sectionIdx={idx} page={page}/>
                                                </div>)}}
                            </Draggable>
                        </React.Fragment>)
                        })}
                        {provided.placeholder}
                    </div>)}}
                </StrictModeDroppable>}
            </DragDropContext>
            {userType === UserType.student && lessonDefinition && lessonDefinition.pages[page].sections.map((section, idx) => {
            return (<React.Fragment key={idx}>
            <LessonSection key={idx} section={section} sectionIdx={idx} page={page} userType={userType}></LessonSection>
            </React.Fragment>)
        })}
        </div>
        
    )
}

export default LessonPage