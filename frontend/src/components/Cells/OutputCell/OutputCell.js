import React from 'react'
import ReactMarkdown from 'react-markdown'
import "../TextCell/TextCell.css"
import "./OutputCell.css"
import remarkGfm from 'remark-gfm'
import "github-markdown-css";
import { GrClear } from "react-icons/gr";


const OutputCell = (props) => {
  return (
    <div className='output-container'>
      <div className='output-title'>{props.titleValue}</div>
      <ReactMarkdown className={'markdown-output markdown-body'} remarkPlugins={[remarkGfm]}>
          {String(props.output)}
      </ReactMarkdown>
      <button  data-cy="clear-output-button" onClick={props.clearOutputHandler} className='clear-output-editor-button editor-button' variant="danger"><GrClear className="grIcon" /></button>
    </div>
  )
}

export default OutputCell