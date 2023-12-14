import { Checkbox } from "@mui/material";
import "./QuizOption.css"
import React, { useRef, useContext, useState } from 'react';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import UserType from '../../../models/UserType';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { COLORS } from '../../../values/colors.js' 
import {BsTrash3} from 'react-icons/bs';

const OptionText = (props) => {
    const headerInput = useRef(null);
    const {updateCell} = useContext(LessonContext);

    const changeOptionHandler = (newOptionText) =>{
        let findId = -1;
        let newCell = window.structuredClone(props.cell);
        for(let i = 0; i<props.options.length; i++){
            if (props.options[i].id === props.option.id ) {
                findId = i;
                break;
            }
        }

        if(findId !== -1){
            
            let newOption = props.cell.options[findId];
            newOption.text = newOptionText;
            newCell.options[findId] = newOption;
            updateCell(newCell, props.cellIdx, props.currentPage, props.sectionIdx);
        }
    }

    const handleHeaderChange = (e) => {
        if (e.key === 'Enter'){
          headerInput.current.blur();
        }
    }

    return (
        <div className='option-text-box'>
            <div ref={headerInput} 
            contentEditable={props.userType === UserType.teacher}
            className='section-header='
            id={props.sidebar ? "option-text-sidebar" : 'option-text'}
            onBlur={e => changeOptionHandler(e.currentTarget.textContent) } 
            onKeyDown={handleHeaderChange} 
            suppressContentEditableWarning={true} 
            spellCheck="false" 
            >
                {props.option.text}
            </div>
        </div>
    );
}

const QuizOption = (props) => {
    const {updateCell} = useContext(LessonContext);
    const [checked, setChecked] = useState(props.option.valid);

    const handleChange = () => {
        setChecked(!checked);
        if (props.userType === UserType.teacher){

            let findId = -1;
            for(let i = 0; i<props.options.length; i++){
                if (props.options[i].id === props.option.id ) {
                    findId = i;
                    break;
                }
            }

            if(findId !== -1){

                let newOption = window.structuredClone(props.cell.options[findId]);
                let newCell = window.structuredClone(props.cell);
                newOption.valid = !checked;
                props.cell.options.splice(findId, 1, newOption);
                newCell['options'][findId].valid = !checked;
                updateCell(props.cell, props.cellIdx, props.currentPage, props.sectionIdx);
            }

        }
        else{

            props.chOpt.forEach((option) => {
                if(option.id === props.option.id){
                    option.valid = !checked;
                }
            })

        }

      };

    const handleClickOnDelete = () => {
        let id = props.option.id;
        let cell = props.cell;
        let optionsList = props.options;

        let findId = -1;
        for(let i = 0; i < optionsList.length; i++){
            if (optionsList[i].id === id ) {
                findId = i;
                break;
            }
        }

        if(findId !== -1){
            let cell_options_size = cell.options.length;
            optionsList.splice(findId, 1);
            if (cell_options_size === cell.options.length){
                cell.options.splice(findId, 1);
            }
            updateCell(cell, props.cellIdx, props.currentPage, props.sectionIdx);
        }

    };

    return (
        <div id="topDiv" className={ props.resultColor === -1 ? 'background-red' : props.resultColor === 0 ? 'background' : 'background-green'}>
            <div className='option-text'>
                <OptionText cell={props.cell} options={props.options} option={props.option} userType={props.userType} currentPage={props.currentPage} page={props.page} sectionIdx={props.sectionIdx} sidebar={props.sidebar}/>
            </div>

            <div className={ props.userType === UserType.teacher ? "right-side" : "right-side-student" }>
                <div className='management'>
                    { props.userType === UserType.teacher ? <div className="text-label-info">poprawna</div>:<div></div>}
                    <div className='checkbox'>
                        <Checkbox style= {{color: COLORS.font_color}} checked={checked} onChange={handleChange}></Checkbox>
                    </div>
                        { props.userType === UserType.teacher ? <React.Fragment><button onClick={handleClickOnDelete} className='button-x'><BsTrash3/></button></React.Fragment>:
                        <React.Fragment></React.Fragment>}
                </div>
            </div>
        </div>
    );
}

export default QuizOption;
