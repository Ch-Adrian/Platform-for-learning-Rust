import React, { useRef, useContext, useState, useEffect, useCallback, memo, Component } from 'react';
import Button from 'react-bootstrap/Button';
import "./QuizCell.css"
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import UserType from '../../../models/UserType';
import {BsTrash3} from 'react-icons/bs';
import {TbGridDots, TbArrowsMove } from 'react-icons/tb';
import MovableMenuContext from '../../miscellaneous/MenuContext/Movable/MovableMenuContext'
import QuizOption from '../../miscellaneous/QuizOptions/QuizOption';
import MDEditor from '@uiw/react-md-editor'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const QuizCell = memo(function QuizCell(props) {
    const containerRef = useRef(null);
    const {updateCell, removeCell} = useContext(LessonContext);
    const [isConnectionError, setIsConnectionError] = useState(false);
    const [options, setOptions] = useState(props.cell.options.map((option) => {
      if(props.userType === UserType.student)
        option.valid = false;
      return option;
    }));
    const [focus, setFocus] = useState(false);
    const [value, setValue] = useState(props.text);
    const prevTextRef = useRef(props.text);


    const addOption = async () => {
      let newId = 0;
      if(options.length > 0){
          newId = options[options.length-1].id + 1;
      }
      let newOption = {'id': newId, 'text': '-- TO EDIT', 'valid': false};
      setOptions([...options, newOption]);
      console.log(options);
      updateOptionsHandler(newOption);
    }

    const checkAnswer = async () => {
      
    }

    const updateOptionsHandler = (value) => {
      let modifiedCell = props.cell;
      if (modifiedCell.options.includes(value)) return;
      modifiedCell.options.push(value);
      updateCell(modifiedCell, props.cellIdx, props.currentPage, props.sectionIdx);
    }

    const blurHandler = (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false);
    }
  
    const focusHandler = (e) => {
      if (e.detail === 2) setFocus(true);
    }

    const updateTextValue = (value) => {
      setValue(value);
      let modifiedCell = props.cell;
      modifiedCell.text = value;
      updateCell(modifiedCell, props.cellIdx, props.currentPage, props.sectionIdx);
    }

    const removeCellHandler = () => {
      removeCell(props.cellIdx, props.currentPage, props.sectionIdx);
    }
    
    return (
      <div ref={containerRef} className={"code-cell-container " + (props.userType === UserType.teacher && "code-cell-container-teacher")} >
        <div className='cell-misc-buttons-container'>
          {props.userType === UserType.teacher && <div className='text-cell-grab' {...props.handleDrag} ><TbGridDots/></div>}
          {props.userType === UserType.teacher && <button className='code-cell-delete-button' onClick={removeCellHandler}><BsTrash3/></button>}
          {props.userType === UserType.teacher && <div ><MovableMenuContext pageID={props.currentPage} sectionID={props.sectionIdx} cellID={props.cellIdx} ><TbArrowsMove /></MovableMenuContext></div> }
        </div>
        
      <div className={props.userType === UserType.teacher ? 'text-cell-container' : null} 
        tabIndex={1}
        onClick={focusHandler}
        onBlur={blurHandler}>

      {props.userType === UserType.teacher && focus ? 
        <MDEditor
        value={value}
        onChange={updateTextValue}
        />
        :
        <ReactMarkdown className={'markdown markdown-body'} remarkPlugins={[remarkGfm]}>
          { value }
        </ReactMarkdown>
      }
    </div>

        {props.userType === UserType.teacher ?
        // TEACHER VERSION
          <React.Fragment>

            {
              options.map(option => (
                <QuizOption key={option.id} option={option} cell={props.cell} userType={props.userType} options={options}
                cellIdx={props.cellIdx} currentPage={props.currentPage} sectionIdx={props.sectionIdx}></QuizOption>
              ))
            }

          <div className='editor-button-container'>
          <Button onClick={addOption} className='editor-button' variant="success">{'Add option'}</Button>
          </div>  

          {isConnectionError ? <div style={{color: 'red'}}>There was some error connecting to the compiler. Please check if all app components are running</div> : null}

          </React.Fragment> 
        : 
        // STUDENT VERSION
          <React.Fragment>
            {
              options.map(option => (
                <QuizOption key={option.id} option={option} cell={props.cell} userType={props.userType} options={options}
                cellIdx={props.cellIdx} currentPage={props.currentPage} sectionIdx={props.sectionIdx}></QuizOption>
              ))
            }

          {isConnectionError ? <div style={{color: 'red'}}>There was some error connecting to the compiler. Please check if all app components are running</div> : null}
          <div className='editor-button-container'>
            <Button onClick={checkAnswer} className='editor-button' variant="success">{'Sprawdź'}</Button>
          </div>
          </React.Fragment>
        }

      </div>
    )
  });

export default QuizCell;