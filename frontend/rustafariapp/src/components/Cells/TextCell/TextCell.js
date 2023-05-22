import React, {useState, useContext, useEffect} from 'react'
import ReactMarkdown from 'react-markdown'
import "./TextCell.css"
import remarkGfm from 'remark-gfm'
import "github-markdown-css"
import MDEditor from '@uiw/react-md-editor'
import UserType from '../../models/UserType'
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider'

const TextCell = (props) => {
  const [value, setValue] = useState(props.text);
  const [focus, setFocus] = useState(false);
  const {updateCell} = useContext(LessonContext);

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false);
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      let modifiedCell = props.cell;
      if (modifiedCell.value === value) return;
      modifiedCell.value = value;
      updateCell(modifiedCell, props.cellIdx, props.currentPage, props.sectionIdx);
    }, 650);
    return () => clearTimeout(timeOutId);
  }, [props.cell, props.cellIdx, props.currentPage, props.sectionIdx, updateCell, value])

  useEffect(() => {
    if (props.text.length !== 0 && props.text === value) return;
    setValue(props.text);
  }, [props.text]);



  return (
    <div className={props.userType === UserType.teacher ? 'text-cell-container' : null} 
      tabIndex={1}
      onFocus={() => setFocus(true)}
      onBlur={handleBlur}>
      {props.userType === UserType.teacher && focus ? 
      <MDEditor
      value={value}
      onChange={setValue}
      />
      : 
      <ReactMarkdown className={'markdown markdown-body'} remarkPlugins={[remarkGfm]}>
        {props.text}
      </ReactMarkdown>
    }  
    </div>
  )
}

export default TextCell