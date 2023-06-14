import React, { useRef, useContext, useState, useCallback, memo } from 'react';
import Button from 'react-bootstrap/Button';
import "./CodeCell.css"
import CodeExecutorService from '../../../services/CodeExecutorService';
import OutputCell from '../OutputCell/OutputCell';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import MonacoEditor from '../../Editor/MonacoEditor';
import UserType from '../../models/UserType';
import {BsTrash3} from 'react-icons/bs';
import {TbGridDots, TbArrowsMove } from 'react-icons/tb';
import MovableMenuContext from '../../miscellaneous/MenuContext/Movable/MovableMenuContext'


const CodeCell = memo(function CodeCell(props) {
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
    if (modifiedCell.value === value) return;
    modifiedCell.value = value;
    updateCell(modifiedCell, props.cellIdx, props.currentPage, props.sectionIdx);
  }, [props.cell, props.cellIdx, props.currentPage, props.sectionIdx, updateCell])

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
    console.log(props.cell)
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
      <MonacoEditor containerRef={containerRef} editorRef={editorRef} updateEditorValueHandler={updateEditorValueHandler} text={props.text}></MonacoEditor>
      <div className='editor-button-container'>
       <Button onClick={compile} className='editor-button' variant="success" disabled={isExecuting}>{!isExecuting ? 'Run code' : 'Running...'}</Button>{' '}
       {props.cell.test === undefined ? <Button onClick={() => {addEditor("test")}} className='editor-button' variant="success">{'Add tests'}</Button> : null}
       {props.cell.reference === undefined ? <Button onClick={() => {addEditor("reference")}} className='editor-button' variant="success">{'Add reference code'}</Button> : null}
       <Button onClick={clearOutput} className='clear-output-editor-button' variant="danger" style={{ display: !props.cell.output ? "none" : "inline"}}>Clear output</Button>{' '}
      </div>  
      {isConnectionError ? <div style={{color: 'red'}}>There was some error connecting to the compiler. Please check if all app components are running</div> : null}
      {props.cell.outputTest && <div> Test Output <OutputCell output={props.cell.outputTest}></OutputCell></div>}
      {props.cell.output && <div><OutputCell output={props.cell.output}></OutputCell></div>}
      {props.cell.test !== undefined ? 
      <div className={"code-cell-container"}> 
        <MonacoEditor containerRef={containerRef} editorRef={testEditorRef} updateEditorValueHandler={updateTestEditorValueHandler} text={props.cell.test}></MonacoEditor>
        <div className='editor-button-container'>
          <Button onClick={() => {removeEditor("test")}} className='editor-button' variant="danger">{'Remove tests'}</Button>
        </div>  
      </div>: null}
      {props.cell.reference !== undefined ? 
      <div className={"code-cell-container"}> 
        <MonacoEditor containerRef={containerRef} editorRef={referenceEditorRef} updateEditorValueHandler={updateReferenceEditorValueHandler} text={props.cell.reference}></MonacoEditor>
        <div className='editor-button-container'>
          <Button onClick={() => {removeEditor("reference")}} className='editor-button' variant="danger">{'Remove reference code'}</Button>
        </div>  
      </div>: null}
      </React.Fragment> 
      : 
      // STUDENT VERSION
      <React.Fragment>
      <MonacoEditor containerRef={containerRef} editorRef={editorRef} updateEditorValueHandler={updateEditorValueHandler} text={props.text}></MonacoEditor>
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

export default CodeCell
