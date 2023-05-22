import React from 'react'
import TextCell from '../../../Cells/TextCell/TextCell'
import CodeCell from '../../../Cells/CodeCell/CodeCell'
import EmptyCell from '../../../Cells/EmptyCell/EmptyCell'
import "./LessonSection.css"
// import currentUser from '../../../miscellaneous/userConfig'
import AddCellButton from '../../../miscellaneous/AddButtons/AddCellButton/AddCellButton'
import UserType from '../../../models/UserType'

const LessonSection = (props) => {
    return (
        <div className='section-container'>
            {props.userType === UserType.teacher && <AddCellButton key={"-1addcell" + props.sectionIdx} cellIdx={-1} currentPage={props.page} sectionIdx={props.sectionIdx} />}
            {props.userType === UserType.teacher && props.section?.cells.map((cell, idx) => {
                let cellToAdd
                if (cell.type === "text") {
                    cellToAdd =
                        (
                            <TextCell key={idx + "text" + props.sectionIdx} text={cell.value} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}></TextCell>
                        )
                } else if (cell.type === "code") {
                    cellToAdd =
                        (
                            <CodeCell key={idx + "code" + props.sectionIdx} text={cell.value} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}></CodeCell>
                        )
                } else if (cell.type === "empty") {
                    cellToAdd =
                        (
                            <EmptyCell key={idx + "empty" + props.sectionIdx} text={cell.value} cell={cell} cellIdx={idx} userType={props.userType}></EmptyCell>
                        )
                }
                if (cellToAdd) {
                    return (<React.Fragment key={idx}>
                        {cellToAdd}
                        <AddCellButton key={idx + "addcell" + props.sectionIdx} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} />
                    </React.Fragment>)
                }
                else
                    return null
            })}
            {props.userType === "STUDENT" && props.section?.cells.map((cell, idx) => {
                if (cell.type === "text") {
                    return (
                        <TextCell key={idx} text={cell.value} cell={cell} cellIdx={idx} userType={props.userType}></TextCell>
                    )
                } else if (cell.type === "code") {
                    return (
                        <CodeCell key={idx} text={cell.value} cell={cell} cellIdx={idx} currentPage={props.page} sectionIdx={props.sectionIdx} userType={props.userType}></CodeCell>
                    )
                } else if (cell.type === "empty") {
                    return (
                        <EmptyCell key={idx} text={cell.value} cell={cell} cellIdx={idx} userType={props.userType}></EmptyCell>
                    )
                }
                else
                    return null
            })}
        </div>
    )
}

export default LessonSection