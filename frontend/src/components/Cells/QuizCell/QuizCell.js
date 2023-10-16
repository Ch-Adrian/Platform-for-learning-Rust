import React, { useRef, useContext, useState, useCallback, memo } from 'react';
import Button from 'react-bootstrap/Button';
import "./QuizCell.css"
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import UserType from '../../../models/UserType';
import {BsTrash3} from 'react-icons/bs';
import {TbGridDots, TbArrowsMove } from 'react-icons/tb';
import MovableMenuContext from '../../miscellaneous/MenuContext/Movable/MovableMenuContext'
import QuizOption from '../../miscellaneous/QuizOptions/QuizOption';


const QuizCell = memo(function QuizCell(props) {
    const containerRef = useRef(null);
    const {updateCell, removeCell} = useContext(LessonContext);
    const [isConnectionError, setIsConnectionError] = useState(false);
    const [options, setOptions] = useState(props.cell.options);

    const addOption = async () => {
      let newOption = {'id': options.length, 'text': '-- TO EDIT', 'valid': false};
      setOptions([...options, newOption]);
      console.log(options);
      updateOptionsHandler(newOption);
      // console.log("adding option ...");
    }

    const updateOptionsHandler = (value) => {
      let modifiedCell = props.cell;
      if (modifiedCell.options.includes(value)) return;
      modifiedCell.options.push(value);
      // console.log('modified cell');
      // console.log(modifiedCell);
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
        {props.cell.reference !== undefined ? 
          <div className={"code-cell-container"}> 
          </div>: null}
        </React.Fragment> 
        : 
        // STUDENT VERSION
        <React.Fragment>
          {
            options.map(option => (
              <QuizOption key={option.id} option={option} cell={props.cell} userType={props.userType} options={options}></QuizOption>
            ))
          }
        <div className='editor-button-container'>
         
        </div>  
        {isConnectionError ? <div style={{color: 'red'}}>There was some error connecting to the compiler. Please check if all app components are running</div> : null}
        </React.Fragment>
        }
      </div>
    )
  })

export default QuizCell;