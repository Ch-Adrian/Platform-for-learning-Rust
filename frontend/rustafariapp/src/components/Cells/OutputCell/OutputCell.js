import React from 'react'
import ReactMarkdown from 'react-markdown'
import "./OutputCell.css"

const OutputCell = (props) => {
  return (
    <ReactMarkdown className='markdown-output'>
        {props.output}
    </ReactMarkdown>
  )
}

export default OutputCell