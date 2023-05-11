import React from 'react'
import TextCell from '../../../Cells/TextCell/TextCell'
import CodeCell from '../../../Cells/CodeCell/CodeCell'
import EmptyCell from '../../../Cells/EmptyCell/EmptyCell'
import "./LessonSection.css"

const LessonSection = (props) => {
  return (
    <div className='section-container'>
            {props.section && props.section.cells.map((cell, idx) => {
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
            }
            return null;
        })}
    </div>
  )
}

export default LessonSection