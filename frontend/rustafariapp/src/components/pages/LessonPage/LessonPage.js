import React, { useContext } from 'react'
import TextCell from '../../Cells/TextCell/TextCell';
import CodeCell from "../../Cells/CodeCell/CodeCell"
import "./LessonPage.css"
import { useParams } from 'react-router-dom'
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';


const LessonPage = () => {
    const { page } = useParams();
    // const location = useLocation();
    const {lessonDefinition} = useContext(LessonContext);

    return (
        <div className='page-container'>
            {lessonDefinition && lessonDefinition.pages[page].cells.map((cell, idx) => {
            if (cell.type === "text") {
                return (
                    <TextCell key={idx} text={cell.value} cell={cell} cellIdx={idx}></TextCell>
                )
            } else if (cell.type === "code") {
                return (
                    <CodeCell key={idx} text={cell.value} cell={cell} cellIdx={idx} currentPage={page}></CodeCell>
                )
            }
            return null;
        })}
        </div>
        
    )
}

export default LessonPage