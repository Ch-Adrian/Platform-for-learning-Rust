import { Checkbox } from "@mui/material";
import "./QuizOption.css"
import Button from 'react-bootstrap/Button';
import React, { useRef, useContext, useState, useCallback, memo } from 'react';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import UserType from '../../../models/UserType';

const OptionText = (props) => {
    // const { getTitle, changeTitle } = useContext(LessonContext);
    const headerInput = useRef(null);
    const {updateCell} = useContext(LessonContext);


    const changeOptionHandler = (newOptionText) =>{
        let findId = -1;
        for(let i = 0; i<props.options.length; i++){
            if (props.options[i].id === props.option.id ) {
                findId = i;
                break;
            }
        }

        if(findId !== -1){
            console.log("found");
            
            let newOption = props.cell.options[findId];
            newOption.text = newOptionText;
            props.cell.options[findId] = newOption;
            updateCell(props.cell, props.cellIdx, props.currentPage, props.sectionIdx);
        }
    }

    const handleHeaderChange = (e) => {
        if (e.key === 'Enter'){
          headerInput.current.blur();
        }
    }

    return (
        <div>
            <div ref={headerInput} 
            contentEditable={props.userType === UserType.teacher}
            className='section-header' 
            onBlur={e => changeOptionHandler(e.currentTarget.textContent) } 
            onKeyDown={handleHeaderChange} 
            suppressContentEditableWarning={true} 
            spellCheck="false" 
            style={{color: 'black', 'fontSize': '20px'}}> 
            
                {props.option.text}
            </div>
        </div>
    );
}


const QuizOption = (props) => {
    const {updateCell, removeCell} = useContext(LessonContext);
    const [checked, setChecked] = React.useState(props.option.valid);

    const handleChange = () => {
        setChecked(!checked);
        let findId = -1;
        for(let i = 0; i<props.options.length; i++){
            if (props.options[i].id === props.option.id ) {
                findId = i;
                break;
            }
        }
        if(findId !== -1){
            console.log("found");
            
            let newOption = props.cell.options[findId];
            newOption.valid = !checked;
            console.log(newOption);
            props.cell.options[findId] = newOption;
            console.log(props.cell);
            updateCell(props.cell, props.cellIdx, props.currentPage, props.sectionIdx);
        }
      };

    const handleClickOnDelete = () => {
        let id = props.option.id;
        let cell = props.cell;
        let optionsList = props.options;
        console.log(optionsList);

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
            if (cell_options_size == cell.options.length){
                cell.options.splice(findId, 1);
            }
            updateCell(cell, props.cellIdx, props.currentPage, props.sectionIdx);
        }

    };

    return (
        <div className='background'>
            <div className='option-text'>
                {
                    console.log(props.option)
                }
                <OptionText cell={props.cell} options={props.options} option={props.option} userType={props.userType} currentPage={props.currentPage} page={props.page} sectionIdx={props.sectionIdx}/>
            </div>
            {/* <input type="text" className='text-field' name='option'/> */}
            <div className='management'>
                <div className='checkbox'>
                    <Checkbox checked={checked} onChange={handleChange}></Checkbox>poprawna</div>
                    { props.userType == UserType.teacher ? <React.Fragment><Button onClick={handleClickOnDelete} className='button-x'>X</Button></React.Fragment>:
                    <React.Fragment></React.Fragment>}
                </div>
        </div>
    );
}

export default QuizOption;
