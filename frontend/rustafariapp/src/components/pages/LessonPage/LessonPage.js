import React, { useEffect, useMemo, useState } from 'react'
import SamplePage from "../../../assets/SampleLessonPage.json"
import TextCell from '../../Cells/TextCell/TextCell';
import CodeCell from "../../Cells/CodeCell/CodeCell"
import "./LessonPage.css"
import { useLocation, useNavigate } from 'react-router-dom'


const LessonPage = () => {

    const location = useLocation()
    const [pageDefinition, setPageDefinition] = useState(null);


    const extractStructure = (page) => {
        page.cells.forEach(element => {
            console.log(element);
        });
    }

    useMemo(() => {
        setPageDefinition(location.state.lessonFile);
    }, [location]);

    return (
        <div className='page-container'>
            {pageDefinition ? pageDefinition.cells.map((cell, idx) => {
            if (cell.type === "text") {
                return (
                    <TextCell key={idx} text={cell.value}></TextCell>
                )
            } else if (cell.type === "code") {
                return (
                    <CodeCell key={idx} text={cell.value}></CodeCell>
                )
            }
        }) 
        : null}
        </div>
        
    )
}

export default LessonPage