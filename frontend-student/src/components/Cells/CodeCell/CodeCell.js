import React, { useRef, useContext, useState, useCallback, memo } from 'react';
import "./CodeCell.css"
import CodeExecutorService from '../../../services/CodeExecutorService';
import OutputCell from '../OutputCell/OutputCell';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import MonacoEditor from '../../Editor/MonacoEditor';
import UserType from '../../../models/UserType';
import { FaPlay } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { GrDocumentTest } from "react-icons/gr";
import { IoMdAdd, IoIosRemove } from "react-icons/io";
import { VscReferences } from "react-icons/vsc";
import { COLORS } from '../../../values/colors.js' 

const CodeCell = memo(function CodeCell(props) {
  const editorRef = useRef(null);
  const testEditorRef = useRef(null);
  const referenceEditorRef = useRef(null);
  const containerRef = useRef(null);
  const {updateCell} = useContext(LessonContext);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isConnectionError, setIsConnectionError] = useState(false);

  const compile = async () => {
    clearCodeOutput()
    clearTestOutput()
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
  }

  const removeEditor = (type) => {
    let modifiedCell = props.cell;
    delete modifiedCell[type];
    updateCell(modifiedCell, props.cellIdx, props.currentPage, props.sectionIdx);
  }

  const clearCodeOutput = async () => {
    let modifiedCell = window.structuredClone(props.cell);
    modifiedCell.output = "";
    updateCell(modifiedCell, props.cellIdx, props.currentPage, props.sectionIdx);
  };

  const clearTestOutput = async () => {
    let modifiedCell = window.structuredClone(props.cell);
    modifiedCell.outputTest = "";
    updateCell(modifiedCell, props.cellIdx, props.currentPage, props.sectionIdx);
  };

  return (
    <div data-cy="code-cell" ref={containerRef} className={"code-cell-container"}>
      {props.userType === UserType.teacher ?
      // TEACHER VERSION
      <React.Fragment>
      <MonacoEditor ref={{containerRef: containerRef, editorRef: editorRef}} updateEditorValueHandler={updateEditorValueHandler} text={props.text}/>  
      <div className='editor-button-container'>
       <button title="Uruchom" data-cy="code-run-button" onClick={compile} className='editor-button' disabled={isExecuting}>{!isExecuting ? <FaPlay color={COLORS.font_color}/> : <HiOutlineDotsHorizontal color="white" />}</button>
       {props.cell.test === undefined ? <button data-cy="add-tests-button" title="Dodaj testy" onClick={() => {addEditor("test")}} className='editor-button' variant="success"><IoMdAdd color="white" /><GrDocumentTest className='grIcon' /></button> : null}
       {props.cell.reference === undefined ? <button data-cy="add-reference-button" title="Dodaj kod referencyjny" onClick={() => {addEditor("reference")}} className='editor-button' variant="success"><IoMdAdd color="white" /><VscReferences color="white" /></button> : null}
      </div>
      {isConnectionError ? <div style={{color: 'red'}}>There was some error connecting to the compiler. Please check if all app components are running</div> : null}
      {props.cell.output ? <div data-cy="code-output"> <OutputCell className='output-cell' titleValue="Rezultat wykonania" clearOutputHandler={clearCodeOutput} output={props.cell.output}></OutputCell></div> : null}
      {props.cell.outputTest ? <div data-cy="test-output"> <OutputCell className='output-cell' titleValue="Rezultat testów" clearOutputHandler={clearTestOutput} output={props.cell.outputTest}></OutputCell></div> : null}
      {props.cell.test !== undefined ?
      <div className={"code-cell-container"}>
        <div className='editor-caption'>Testy</div>
        <MonacoEditor ref={{containerRef: containerRef, editorRef: testEditorRef}} updateEditorValueHandler={updateTestEditorValueHandler} text={props.cell.test}></MonacoEditor>
        <div className='editor-button-container'>
          <button data-cy="remove-tests-button" title="Usuń testy" onClick={() => {removeEditor("test")}} className='editor-button' variant="danger"><IoIosRemove color="white" /><GrDocumentTest className='grIcon' /></button>
        </div>  
      </div> : null}
      {props.cell.reference !== undefined ? 
      <div className={"code-cell-container"}> 
        <div className='editor-caption'>Kod referencyjny</div>
        <MonacoEditor ref={{containerRef: containerRef, editorRef: referenceEditorRef}} updateEditorValueHandler={updateReferenceEditorValueHandler} text={props.cell.reference}></MonacoEditor>
        <div className='editor-button-container'>
          <button data-cy="remove-reference-button" title="Usuń kod referencyjny" onClick={() => {removeEditor("reference")}} className='editor-button' variant="danger"><IoIosRemove color="white" /><VscReferences color="white" /></button>
        </div>  
      </div>: null}
      </React.Fragment>
      : 
      // STUDENT VERSION
      <React.Fragment>
      <div>
        <MonacoEditor ref={{containerRef: containerRef, editorRef: editorRef}} updateEditorValueHandler={updateEditorValueHandler} text={props.text}></MonacoEditor>
      </div>
      <div className='editor-button-container'>
        <button title="Uruchom" data-cy="code-run-button" onClick={compile} className='editor-button' disabled={isExecuting}>{!isExecuting ? <FaPlay color='white'/> : <HiOutlineDotsHorizontal color="white" />}</button>
      </div>  
      {isConnectionError ? <div style={{color: 'red'}}>There was some error connecting to the compiler. Please check if all app components are running</div> : null}
      {props.cell.output && <div><OutputCell titleValue="Rezultat wykonania" clearOutputHandler={clearCodeOutput} output={props.cell.output}></OutputCell></div>}
      {props.cell.outputTest && <div><OutputCell titleValue="Rezultat testów" clearOutputHandler={clearTestOutput} output={props.cell.outputTest}></OutputCell></div>}
      </React.Fragment>
      }
    </div>
  )
})

export default CodeCell;