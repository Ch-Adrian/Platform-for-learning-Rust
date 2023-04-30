import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./HomePage.css"
import FilePicker from '../../miscellaneous/FilePicker/FilePicker';

function HomePage() {
    const navigate = useNavigate();

    const loadPage = (lessonFile, lessonName) => {
        navigate(`/lesson/${lessonName}/0`, {state: {lessonFile: lessonFile}});
    }

    return (
        <div className='file-picker-container'>
            <FilePicker openLesson={loadPage}/>
        </div>
    )
}

export default HomePage
