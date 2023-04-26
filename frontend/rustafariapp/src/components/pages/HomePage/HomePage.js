import React from 'react'
import { useNavigate } from 'react-router-dom'
import SamplePage from "../../../assets/SampleLessonPage.json"
import "./HomePage.css"
import FilePicker from '../../miscellaneous/FilePicker/FilePicker';

function HomePage() {
    const navigate = useNavigate();

    let pageDefinition = SamplePage;

    const loadPage = (lessonFile) => {
        navigate('/lesson', {state: {lessonFile: lessonFile}});
    }

    return (
        <div className='file-picker-container'>
            <FilePicker openLesson={loadPage}/>
        </div>
    )
}

export default HomePage
