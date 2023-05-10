import React from 'react'
import ReactMarkdown from 'react-markdown'
import "../TextCell/TextCell.css"
import "./OutputCell.css"
import remarkGfm from 'remark-gfm'
import "github-markdown-css"

const OutputCell = (props) => {
  return (
    <ReactMarkdown className={'markdown-output markdown-body'} remarkPlugins={[remarkGfm]}>
        {props.output}
    </ReactMarkdown>
  )
}

export default OutputCell