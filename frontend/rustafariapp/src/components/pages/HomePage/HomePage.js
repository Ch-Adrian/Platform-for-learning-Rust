import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import "./HomePage.css"
import FilePicker from '../../miscellaneous/FilePicker/FilePicker';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import { useEffect } from 'react';

function HomePage() {
    const navigate = useNavigate();
    const {setLessonDefinition, setLessonLocalPath} = useContext(LessonContext);

    const loadPage = (lessonFile, lessonName) => {
        setLessonDefinition(lessonFile);
        window.localStorage.setItem('lessonFileName', lessonName);
        navigate(`/lesson/${lessonName}/0`, {state: {lessonFile: lessonFile}});
    }

    useEffect(() => {
        setLessonLocalPath(undefined);
        window.localStorage.setItem('lessonFileName', undefined);
    })

    return (
        <div className='file-picker-container'>
            <FilePicker openLesson={loadPage}/>
        </div>
    )
}

export default HomePage
