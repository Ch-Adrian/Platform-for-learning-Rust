import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import "./HomePage.css"
import FilePicker from '../../miscellaneous/FilePicker/FilePicker';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import LessonFileSaveService from '../../../services/LessonFileHandleService';

function HomePage() {
    const navigate = useNavigate();
    const {setLessonDefinition, setLessonName} = useContext(LessonContext);

    const loadPage = async (lessonFile, lessonName) => {
        setLessonDefinition(lessonFile);
        setLessonName(lessonName.split('.json')[0]);
        LessonFileSaveService.createLesson(lessonFile, lessonName.split('.json')[0])
        .catch((e) => console.log(e));
        
        
        navigate(`/lesson/${lessonName}/0`, {state: {lessonFile: lessonFile}});
    }

    return (
        <div className='file-picker-container'>
            <FilePicker openLesson={loadPage}/>
        </div>
    )
}

export default HomePage
