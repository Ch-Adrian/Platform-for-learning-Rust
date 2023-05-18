import React, { useState } from 'react'
import TextCell from '../../../Cells/TextCell/TextCell'
import CodeCell from '../../../Cells/CodeCell/CodeCell'
import EmptyCell from '../../../Cells/EmptyCell/EmptyCell'
import "./LessonSection.css"
import currentUser from '../../../miscellaneous/userConfig'
import AddCellButton from '../../../miscellaneous/AddCellButton/AddCellButton'

const LessonSection = (props) => {
    const [userType, setUserType] = useState(currentUser);


  return (
    <div className='section-container'>
            {userType === "TEACHER" && props.section && props.section.cells.map((cell, idx) => {
            let cellToAdd;
            if (cell.type === "text") {
                cellToAdd = 
                (
                    <TextCell key={idx+"text"+props.sectionIdx} text={cell.value} cell={cell} cellIdx={idx}></TextCell>
                )
            } else if (cell.type === "code") {
                cellToAdd = 
                (
                    <CodeCell key={idx+"code"+props.sectionIdx} text={cell.value} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx}></CodeCell>
                )
            } else if (cell.type === "empty") {
                cellToAdd = 
                (
                    <EmptyCell key={idx+"empty"+props.sectionIdx} text={cell.value} cell={cell} cellIdx={idx}></EmptyCell>
                )
            }
            if (cellToAdd){
                return (<React.Fragment key={idx}>
                {cellToAdd}
                <AddCellButton key={idx+"addcell"+props.sectionIdx} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx}/>
                </React.Fragment>)
            } else return null;
        })}
        {userType === "STUDENT" && props.section && props.section.cells.map((cell, idx) => {
            if (cell.type === "text") {
                return (
                    <TextCell key={idx} text={cell.value} cell={cell} cellIdx={idx}></TextCell>
                )
            } else if (cell.type === "code") {
                return (
                    <CodeCell key={idx} text={cell.value} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx}></CodeCell>
                )
            } else if (cell.type === "empty") {
                return (
                    <EmptyCell key={idx} text={cell.value} cell={cell} cellIdx={idx}></EmptyCell>
                )
            } else return null;
        })}
    </div>
  )
}

export default LessonSection