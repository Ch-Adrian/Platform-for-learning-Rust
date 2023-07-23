import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import "./HomePage.css"
import FilePicker from '../../miscellaneous/FilePicker/FilePicker';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import LessonFileSaveService from '../../../services/LessonFileHandleService';
import ListLessons from '../../miscellaneous/ListLessons/ListLessons';

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
        <div className='home-page'>
            <div className='list-lesson-container'>
                <h2 className='title'>Wybierz lekcję którą chcesz rozpocząć</h2>
                <div className='list-lessons'>
                    <ListLessons openLesson={loadPage}></ListLessons>
                </div>
            </div>
            <div className='file-picker-container'>
                <FilePicker openLesson={loadPage}/>
            </div>
        </div>
        
    )
}

export default HomePage
