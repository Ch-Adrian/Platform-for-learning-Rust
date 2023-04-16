import React from 'react'
import ReactMarkdown from 'react-markdown'
import "./TextCell.css"

const TextCell = (props) => {
  return (
    <div >
      <ReactMarkdown className='markdown'>
        {props.text}
      </ReactMarkdown>
    </div>
  )
}

export default TextCell