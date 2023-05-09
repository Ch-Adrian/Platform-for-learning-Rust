import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import "./HomePage.css"
import FilePicker from '../../miscellaneous/FilePicker/FilePicker';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';

function HomePage() {
    const navigate = useNavigate();
    const {setLessonDefinition} = useContext(LessonContext);

    const loadPage = (lessonFile, lessonName) => {
        setLessonDefinition(lessonFile);
        navigate(`/lesson/${lessonName}/0`, {state: {lessonFile: lessonFile}});
    }

    return (
        <div className='file-picker-container'>
            <FilePicker openLesson={loadPage}/>
        </div>
    )
}

export default HomePage
