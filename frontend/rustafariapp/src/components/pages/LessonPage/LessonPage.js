import React, { useMemo, useState } from 'react'
import TextCell from '../../Cells/TextCell/TextCell';
import CodeCell from "../../Cells/CodeCell/CodeCell"
import "./LessonPage.css"
import { useLocation, useParams } from 'react-router-dom'
import EmptyCell from '../../Cells/EmptyCell/EmptyCell';


const LessonPage = () => {
    const { page } = useParams();
    const location = useLocation();
    const [lessonDefinition, setLessonDefinition] = useState(null);


    useMemo(() => {
        setLessonDefinition(location.state.lessonFile);
    }, [location]);

    const updateCell = (newCell, idx) => {
        let modifiedPage = {...lessonDefinition};
        modifiedPage.pages[page].cells[idx] = newCell;
        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === page) return {cells: modifiedPage.pages[page].cells}
                else return {...pageDef}

            })
        });
    }

    return (
        <div className='page-container'>
            {lessonDefinition && lessonDefinition.pages[page].cells.map((cell, idx) => {
            if (cell.type === "text") {
                return (
                    <TextCell key={idx} text={cell.value} cell={cell} cellIdx={idx}></TextCell>
                )
            } else if (cell.type === "code") {
                return (
                    <CodeCell key={idx} text={cell.value} cell={cell} cellIdx={idx} updateCell={updateCell}></CodeCell>
                )
            } else if (cell.type === "empty") {
                return (
                    <EmptyCell key={idx} text={cell.value} cell={cell} cellIdx={idx}></EmptyCell>
                )
            }
            return null;
        })}
        </div>
        
    )
}

export default LessonPage