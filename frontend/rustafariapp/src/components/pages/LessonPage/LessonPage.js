import React, { useContext, useState } from 'react'
import "./LessonPage.css"
import { useParams } from 'react-router-dom'
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import LessonSection from './LessonSection/LessonSection';
import currentUser from '../../miscellaneous/userConfig';
import UserType from '../../models/UserType';
import AddSectionButton from '../../miscellaneous/AddButtons/AddSectionButton/AddSectionButton';


const LessonPage = () => {
    const [userType, setUserType] = useState(currentUser);
    const { page } = useParams();
    // const location = useLocation();
    const {lessonDefinition} = useContext(LessonContext);

    console.log(lessonDefinition);

    return (
        <div className='page-container'>
            {userType === UserType.teacher && <AddSectionButton key={"-1addSection"+page} sectionIdx={-1} page={page}/>}
            {userType === UserType.teacher && lessonDefinition && lessonDefinition.pages[page].sections.map((section, idx) => {
            return (<React.Fragment key={idx}>
            <LessonSection key={idx} section={section} sectionIdx={idx} page={page} userType={userType}></LessonSection>
            <AddSectionButton key={idx+"addSection"+page} sectionIdx={idx} page={page}/>
            </React.Fragment>)
        })}
            {userType === UserType.student && lessonDefinition && lessonDefinition.pages[page].sections.map((section, idx) => {
            return (<React.Fragment key={idx}>
            <LessonSection key={idx} section={section} sectionIdx={idx} page={page} userType={userType}></LessonSection>
            </React.Fragment>)
        })}
        </div>
        
    )
}

export default LessonPage