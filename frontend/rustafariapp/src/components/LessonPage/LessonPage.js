import React from 'react'
import SamplePage from "../../assets/SampleLessonPage.json"
import TextCell from '../Cells/TextCell/TextCell';
import CodeCell from "../Cells/CodeCell/CodeCell"
import "./LessonPage.css"


const LessonPage = () => {

    let pageDefinition = SamplePage;
    console.log(pageDefinition["pages"]);

    const extractStructure = (page) => {
        page.cells.forEach(element => {
            console.log(element);
        });
    }

    extractStructure(pageDefinition);
    return (
        <div className='page-container'>
            {pageDefinition.cells.map((cell, idx) => {
            if (cell.type === "text") {
                return (
                    <TextCell key={idx} text={cell.value}></TextCell>
                )
            } else if (cell.type === "code") {
                return (
                    <CodeCell key={idx} text={cell.value}></CodeCell>
                )
            }
        })}
        </div>
        
    )
}

export default LessonPage