import React from 'react'
import ReactMarkdown from 'react-markdown'
import "./TextCell.css"
import remarkGfm from 'remark-gfm'
import "github-markdown-css"

const TextCell = (props) => {
  return (
    <div >
      <ReactMarkdown className={'markdown markdown-body'} remarkPlugins={[remarkGfm]}>
        {props.text}
      </ReactMarkdown>
    </div>
  )
}

export default TextCell