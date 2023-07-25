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

    const loadImportedLesson = async (lessonFile, lessonName) => {
    
        const newLessonName = await LessonFileSaveService.createLesson(lessonFile, lessonName.split('.json')[0])
        .catch((e) => console.log(e));

        const name = newLessonName.data;
        setLessonName(name.split('.json')[0]);
        setLessonDefinition(lessonFile);
        
        
        navigate(`/lesson/${name}/0`, {state: {lessonFile: lessonFile}});
    }

    const loadNewLesson = async () => {
        const lessonFile = await LessonFileSaveService.getDefaultLesson();
        loadImportedLesson(lessonFile.data.lesson, lessonFile.data.name);
    }

    const loadLesson = async (lessonFile, lessonName) => {
        setLessonDefinition(lessonFile);
        setLessonName(lessonName.split('.json')[0]);
         
        navigate(`/lesson/${lessonName}/0`, {state: {lessonFile: lessonFile}});
    }

    return (
        <div className='home-page'>
            <div className='list-lesson-container'>
                <ListLessons openLesson={loadLesson}/>
            </div>
            <div className='file-picker-container'>
                <FilePicker openLesson={loadImportedLesson}/>
                <div className='default-lesson-button' onClick={loadNewLesson}>Stwórz nową lekcję</div>
            </div>
        </div>
        
    )
}

export default HomePage
