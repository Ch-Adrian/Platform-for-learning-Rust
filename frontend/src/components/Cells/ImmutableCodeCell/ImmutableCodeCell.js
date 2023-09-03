import React, { useRef, useContext, useState, useCallback, memo } from 'react';
import Button from 'react-bootstrap/Button';
import "./ImmutableCodeCell.css"
import CodeExecutorService from '../../../services/CodeExecutorService';
import OutputCell from '../OutputCell/OutputCell';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import MonacoEditor from '../../Editor/MonacoEditor';
import UserType from '../../../models/UserType';
import {BsTrash3} from 'react-icons/bs';
import {TbGridDots, TbArrowsMove } from 'react-icons/tb';
import MovableMenuContext from '../../miscellaneous/MenuContext/Movable/MovableMenuContext'

const SEPARATOR_STRING = "/*TO_FILL*/";

const createValidationRegex = (immutablePhrases) => {
  immutablePhrases = immutablePhrases.map(phrase => escapeRegExp(phrase.trim()));
  let reg = "^.*?(";
  reg += immutablePhrases.join(").*?(");
  reg += ").*";
  return new RegExp(reg, "gs");
}

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const ImmutableCodeCell = memo(function ImmutableCodeCell(props) {
    const editorRef = useRef(null);
    const testEditorRef = useRef(null);
    const referenceEditorRef = useRef(null);
    const containerRef = useRef(null);
    const {updateCell, removeCell} = useContext(LessonContext);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isConnectionError, setIsConnectionError] = useState(false);
  
    const compile = async () => {
      setIsConnectionError(false);
      setIsExecuting(true);
      let modifiedCell = props.cell;
      if (props.cell.test){
        await CodeExecutorService.compileTestAndRun(editorRef.current.getValue(), props.cell.test)
        .then((res) => {
          modifiedCell.outputTest = res.data;
          modifiedCell.outputTest += "\n";
        })
        .catch((err) => setIsConnectionError(true));
      }
      
  
      await CodeExecutorService.compileAndRun(editorRef.current.getValue())
      .then((res) => {
        modifiedCell.output = res.data;
        updateCell(modifiedCell, props.cellIdx, props.currentPage, props.sectionIdx);
      })
      .catch((err) => {
        setIsConnectionError(true)
      });
      setIsExecuting(false);
    };
  
    const updateEditorValueHandler = useCallback((value) => {
      let modifiedCell = props.cell;
      const immutablePhrases = props.cell.reference.split(SEPARATOR_STRING);
      const regExp = createValidationRegex(immutablePhrases);
      if (regExp.exec(value) === null){
        const oldValue = props.cell.value;
        let oldCursorPosition = editorRef.current.getPosition();
        oldCursorPosition.column -= (value.length - oldValue.length);
        editorRef.current?.getModel().setValue(oldValue);
        editorRef.current?.setPosition(oldCursorPosition);
        return;
      }

      if (modifiedCell.value === value) return;
      modifiedCell.value = value;
      updateCell(modifiedCell, props.cellIdx, props.currentPage, props.sectionIdx);
    }, [props.cell, props.cellIdx, props.currentPage, props.sectionIdx, updateCell, editorRef])
  
    const updateTestEditorValueHandler = useCallback((value) => {
      let modifiedCell = props.cell;
      if (modifiedCell.test === value) return;
      modifiedCell.test = value;
      updateCell(modifiedCell, props.cellIdx, props.currentPage, props.sectionIdx);
    }, [props.cell, props.cellIdx, props.currentPage, props.sectionIdx, updateCell])
  
    const updateReferenceEditorValueHandler = useCallback((value) => {
      let modifiedCell = props.cell;
      if (modifiedCell.reference === value) return;
      modifiedCell.reference = value;
      updateCell(modifiedCell, props.cellIdx, props.currentPage, props.sectionIdx);
    }, [props.cell, props.cellIdx, props.currentPage, props.sectionIdx, updateCell])
  
    const addEditor = (type) => {
      let modifiedCell = props.cell;
      modifiedCell[type] = "";
      updateCell(modifiedCell, props.cellIdx, props.currentPage, props.sectionIdx);
    }
  
    const removeEditor = (type) => {
      let modifiedCell = props.cell;
      delete modifiedCell[type];
      updateCell(modifiedCell, props.cellIdx, props.currentPage, props.sectionIdx);
    }
  
    const removeCellHandler = () => {
      removeCell(props.cellIdx, props.currentPage, props.sectionIdx);
    }
  
    const clearOutput = async () => {
      let modifiedCell = props.cell;
      modifiedCell.output = "";
      updateCell(modifiedCell, props.cellIdx, props.currentPage, props.sectionIdx);
    };
  
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
        <MonacoEditor ref={{containerRef: containerRef, editorRef: editorRef}} updateEditorValueHandler={updateEditorValueHandler} text={props.text}></MonacoEditor>
        <div className='editor-button-container'>
         <Button onClick={compile} className='editor-button' variant="success" disabled={isExecuting}>{!isExecuting ? 'Run code' : 'Running...'}</Button>{' '}
         {props.cell.test === undefined ? <Button onClick={() => {addEditor("test")}} className='editor-button' variant="success">{'Add tests'}</Button> : null}
         <Button onClick={clearOutput} className='clear-output-editor-button' variant="danger" style={{ display: !props.cell.output ? "none" : "inline"}}>Clear output</Button>{' '}
        </div>  
        {isConnectionError ? <div style={{color: 'red'}}>There was some error connecting to the compiler. Please check if all app components are running</div> : null}
        {props.cell.outputTest && <div> Test Output <OutputCell output={props.cell.outputTest}></OutputCell></div>}
        {props.cell.output && <div><OutputCell output={props.cell.output}></OutputCell></div>}
        {props.cell.test !== undefined ? 
        <div className={"code-cell-container"}> 
          <MonacoEditor ref={{containerRef: containerRef, editorRef: testEditorRef}} updateEditorValueHandler={updateTestEditorValueHandler} text={props.cell.test}></MonacoEditor>
          <div className='editor-button-container'>
            <Button onClick={() => {removeEditor("test")}} className='editor-button' variant="danger">{'Remove tests'}</Button>
          </div>  
        </div>: null}
        {props.cell.reference !== undefined ? 
        <div className={"code-cell-container"}> 
          <MonacoEditor ref={{containerRef: containerRef, editorRef: referenceEditorRef}} updateEditorValueHandler={updateReferenceEditorValueHandler} text={props.cell.reference}></MonacoEditor>
        </div>: null}
        </React.Fragment> 
        : 
        // STUDENT VERSION
        <React.Fragment>
        <MonacoEditor ref={{containerRef: containerRef, editorRef: editorRef}} updateEditorValueHandler={updateEditorValueHandler} text={props.text}></MonacoEditor>
        <div className='editor-button-container'>
         <Button onClick={compile} className='editor-button' variant="success" disabled={isExecuting}>{!isExecuting ? 'Run code' : 'Running...'}</Button>{' '}
        </div>  
        {isConnectionError ? <div style={{color: 'red'}}>There was some error connecting to the compiler. Please check if all app components are running</div> : null}
        {props.cell.outputTest && <div> Test Output <OutputCell output={props.cell.outputTest}></OutputCell></div>}
        {props.cell.output && <div> Code output <OutputCell output={props.cell.output}></OutputCell></div>}
        </React.Fragment>
        }
      </div>
    )
  })

export default ImmutableCodeCell