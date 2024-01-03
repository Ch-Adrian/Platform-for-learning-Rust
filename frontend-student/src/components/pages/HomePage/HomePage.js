'use client'

import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import "./HomePage.css"
import FilePicker from '../../miscellaneous/FilePicker/FilePicker';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import LessonFileSaveService from '../../../services/LessonFileHandleService';
import ListLessons from '../../miscellaneous/ListLessons/ListLessons';
import defaultCargoToml from '../../../config/cargoToml';
import currentUser from '../../../config/userConfig';
import UserType from '../../../models/UserType';

const BACKEND_PATH = "pl.edu.agh.backend.lesson.cells."
const DEFINED_USER_TYPE = currentUser;

function HomePage() {
    const navigate = useNavigate();
    const {setLessonDefinition, setLessonName} = useContext(LessonContext);

    const handleConfigEmpty = (lessonDefinition) => {
        if (lessonDefinition.cargoToml === null ||
            lessonDefinition.cargoToml === undefined ||
            lessonDefinition.cargoToml.trim() === ""){
                lessonDefinition.cargoToml = defaultCargoToml;
            }
    }

    const loadImportedLesson = async (lessonFile, lessonName) => {
    
        lessonFile.pages.forEach((page) => {
            page.sections.forEach((section) => {
                section.cells.forEach((cell) => {
                    cell.profileType = BACKEND_PATH + cell.type;
                });
            });
        });

        const uniqueLessonName = await LessonFileSaveService.createLesson(lessonFile, lessonName.split('.json')[0]);
        loadLesson(lessonFile, uniqueLessonName.data);
    }

    const loadNewLesson = async () => {
        const lessonFile = await LessonFileSaveService.getDefaultLesson();
        loadLesson(lessonFile.data.lesson, lessonFile.data.name);
    }

    const loadLesson = async (lessonFile, lessonName) => {
        setLessonDefinition(lessonFile);
        setLessonName(lessonName.split('.json')[0]);
        handleConfigEmpty(lessonFile);
         
        navigate(`/lesson/${lessonName}/0`, {state: {lessonFile: lessonFile}});
    }

    return (
        <div className='home-page'>
            <div className='list-lesson-container'>
                <ListLessons openLesson={loadLesson}/>
            </div>
            <div className='file-picker-container'>
                <FilePicker openLesson={loadImportedLesson}/>
            </div>
        </div>
        
    )
}

export default HomePage
