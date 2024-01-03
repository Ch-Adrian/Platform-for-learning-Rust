import React, { useContext } from 'react'
import "./LessonPage.css"
import { useParams } from 'react-router-dom'
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import LessonSection from './LessonSection/LessonSection';
import UserType from '../../../models/UserType';
import AddSectionButton from '../../miscellaneous/AddButtons/AddSectionButton/AddSectionButton';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import StrictModeDroppable from '../../miscellaneous/Droppable/StrictModeDroppable';

const LessonPage = ({userType, setUserType, sidebar}) => {
    const { page } = useParams();
    const {lessonDefinition, setLessonDefinition} = useContext(LessonContext);

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        let modifiedLesson = window.structuredClone(lessonDefinition);;
        if (result.draggableId.includes("cell")){
            const srcSectionIdx = result.source.droppableId.split("section")[1]
            const destSectionIdx = result.destination.droppableId.split("section")[1]
            const [reorderedCell] = modifiedLesson.pages[page].sections[srcSectionIdx].cells.splice(result.source.index, 1);
            modifiedLesson.pages[page].sections[destSectionIdx].cells.splice(result.destination.index, 0, reorderedCell);
        } else {
            const [reorderedSection] = modifiedLesson.pages[page].sections.splice(result.source.index, 1);
            modifiedLesson.pages[page].sections.splice(result.destination.index, 0, reorderedSection);
        }
        setLessonDefinition(modifiedLesson);
    }

    return (
        <div className='page-container' data-cy="lesson-page-container">
            <DragDropContext onDragEnd={handleOnDragEnd}>
                {userType === UserType.student && <div className='top-page-padding'/>}
            </DragDropContext>
            {userType === UserType.student && lessonDefinition && lessonDefinition.pages[page].sections.map((section, idx) => {
            return (<React.Fragment key={idx}>
            <LessonSection  key={idx} section={section} sectionIdx={idx} page={page} userType={userType} sidebar={sidebar}></LessonSection>
            </React.Fragment>)
        })}
        </div>
        
    )
}

export default LessonPage