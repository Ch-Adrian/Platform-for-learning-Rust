import React, {useContext} from 'react'
import {BsTrash3} from 'react-icons/bs';
import {TbGridDots, TbArrowsMove } from 'react-icons/tb';
import UserType from '../../models/UserType';
import MovableMenuContext from '../miscellaneous/MenuContext/Movable/MovableMenuContext';
import { LessonContext } from '../../contexts/LessonContext/LessonContextProvider';
import "./Cell.css"

const Cell = (props) => {
    const {removeCell} = useContext(LessonContext);
    const removeCellHandler = () => {
        removeCell(props.cellIdx, props.currentPage, props.sectionIdx);
    }
    console.log(props.userType);
    return (
    <div className={(props.userType === UserType.teacher ? 'cell-container' : null) + ' base-cell'}>
        <div className='cell-misc-buttons-container'>
          {props.userType === UserType.teacher && <div className='cell-grab' {...props.handleDrag} ><TbGridDots/></div>}
          {props.userType === UserType.teacher && <button className='cell-delete-button' onClick={removeCellHandler}><BsTrash3/></button>}
          {props.userType === UserType.teacher && <div ><MovableMenuContext pageID={props.currentPage} sectionID={props.sectionIdx} cellID={props.cellIdx} ><TbArrowsMove /></MovableMenuContext></div> }
        </div>
        {props.children}
    </div>
  )
}

export default Cell