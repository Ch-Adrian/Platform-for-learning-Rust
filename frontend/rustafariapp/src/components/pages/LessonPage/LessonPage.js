import React, { useMemo, useState } from 'react'
import TextCell from '../../Cells/TextCell/TextCell';
import CodeCell from "../../Cells/CodeCell/CodeCell"
import "./LessonPage.css"
import { useLocation } from 'react-router-dom'


const LessonPage = () => {

    const location = useLocation()
    const [pageDefinition, setPageDefinition] = useState(null);


    useMemo(() => {
        setPageDefinition(location.state.lessonFile);
    }, [location]);

    const updateCell = (newCell, idx) => {
        setPageDefinition({
            cells: pageDefinition.cells.map((cell, i) => {
                if (i === idx) return newCell;
                return cell;
            })
        });
    }

    return (
        <div className='page-container'>
            {pageDefinition && pageDefinition.cells.map((cell, idx) => {
            if (cell.type === "text") {
                return (
                    <TextCell key={idx} text={cell.value} cell={cell} cellIdx={idx}></TextCell>
                )
            } else if (cell.type === "code") {
                return (
                    <CodeCell key={idx} text={cell.value} cell={cell} cellIdx={idx} updateCell={updateCell}></CodeCell>
                )
            }
            return null;
        })}
        </div>
        
    )
}

export default LessonPage