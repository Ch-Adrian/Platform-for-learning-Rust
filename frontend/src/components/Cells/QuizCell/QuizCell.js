import React, { useRef, useContext, useState, useEffect, memo } from 'react';
import Button from 'react-bootstrap/Button';
import "./QuizCell.css"
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import UserType from '../../../models/UserType';
import QuizOption from '../../miscellaneous/QuizOptions/QuizOption';
import MDEditor from '@uiw/react-md-editor'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update state to force render
}

const QuizCell = memo(function QuizCell(props) {
    const containerRef = useRef(null);
    const {updateCell} = useContext(LessonContext);
    const [isConnectionError, setIsConnectionError] = useState(false);
    const [options, setOptions] = useState(props.content);
    const [chOpt, setChOpt] = useState(JSON.parse(JSON.stringify(props.cell.options)).map((val) => {
      val.valid = false;
      return val;
    }));
    const [resultColor, setResultColor] = useState(Array(props.cell.options.length).fill(0));
    const [focus, setFocus] = useState(false);
    const [value, setValue] = useState(props.text);
    const prevTextRef = useRef(props.text);
    const prevContentRef = useRef(props.content);
    const forceUpdate = useForceUpdate();

    useEffect(() => {
      prevTextRef.current = value;
    }, [value])

    useEffect(() => {
      prevContentRef.current = options;
    }, [options])
  
    useEffect(() => {
      if (!(props.text.length !== 0 && props.text === prevTextRef.current)) {
        setValue(props.text);
      };
      if (!(props.content.length !== 0 && props.content === prevContentRef.current)) {
        setOptions(props.content);
      }
    }, [props.text, props.content]);


    const addOption = async () => {
      let newId = 0;
      if(options.length > 0){
          newId = options[options.length-1].id + 1;
      }
      let newOption = {'id': newId, 'text': '-- TO EDIT', 'valid': false};
      setOptions([...options, newOption]);
      updateOptionsHandler(newOption);
      resultColor.push(0);
      setResultColor(resultColor);
    }

    const checkAnswer = async () => {
      for(let i = 0; i< options.length; i++){
        if(options[i].valid !== chOpt[i].valid){
          resultColor[i] = -1;
          setResultColor(resultColor);
        }
        else{
          resultColor[i] = 1;
          setResultColor(resultColor);
        }
      }
      forceUpdate();
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
      modifiedCell.value = value;
      updateCell(modifiedCell, props.cellIdx, props.currentPage, props.sectionIdx);
    }
    
    return (
      <div data-cy="quiz-cell" ref={containerRef} className={"code-cell-container"} >

      <div className={props.userType === UserType.teacher ? 'text-cell-container' : null} 
        tabIndex={1}
        onClick={focusHandler}
        onBlur={blurHandler}>

      {props.userType === UserType.teacher && focus ? 
        <MDEditor
        className='markdown'
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
              options.map((option, idx) => (
                <QuizOption resultColor={resultColor[idx]} key={option.id} option={option} cell={props.cell} userType={props.userType} options={options}
                cellIdx={props.cellIdx} currentPage={props.currentPage} sectionIdx={props.sectionIdx} chOpt={chOpt}></QuizOption>
              ))
            }

          <div className='editor-button-container'>
          <Button onClick={addOption} className='editor-button' variant="dark">{'Add option'}</Button>
          </div>  

          {isConnectionError ? <div style={{color: 'red'}}>There was some error connecting to the compiler. Please check if all app components are running</div> : null}

          </React.Fragment> 
        : 
        // STUDENT VERSION
          <React.Fragment>
            {
              chOpt.map((option, idx) => (
                  <QuizOption resultColor={resultColor[idx]} key={option.id} option={option} cell={props.cell} userType={props.userType} options={options}
                    cellIdx={props.cellIdx} currentPage={props.currentPage} sectionIdx={props.sectionIdx} chOpt={chOpt}></QuizOption>
              ))
            }

          {isConnectionError ? 
          <div style={{color: 'red'}}>There was some error connecting to the compiler. Please check if all app components are running</div> :
           null}
          <div className='editor-button-container'>
            <Button onClick={checkAnswer} className='editor-button' variant="success">{'Sprawdź'}</Button>
          </div>
          </React.Fragment>
        }

      </div>
    )
  });

export default QuizCell;
