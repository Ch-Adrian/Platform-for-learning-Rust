import React, { useContext } from 'react'
import "./LessonPage.css"
import { useParams } from 'react-router-dom'
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import LessonSection from './LessonSection/LessonSection';


const LessonPage = () => {
    const { page } = useParams();
    // const location = useLocation();
    const {lessonDefinition} = useContext(LessonContext);

    console.log(lessonDefinition);

    return (
        <div className='page-container'>
            {lessonDefinition && lessonDefinition.pages[page].sections.map((section, idx) => {
            return <LessonSection key={idx} section={section} sectionIdx={idx} page={page}></LessonSection>
        })}
        </div>
        
    )
}

export default LessonPage