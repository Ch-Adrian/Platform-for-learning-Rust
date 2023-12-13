import React, { useRef, useContext, useState, useCallback, memo } from 'react';
import "./ImmutableCodeCell.css"
import CodeExecutorService from '../../../services/CodeExecutorService';
import OutputCell from '../OutputCell/OutputCell';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import MonacoEditor from '../../Editor/MonacoEditor';
import UserType from '../../../models/UserType';
import MutableStringPicker from './MutableStringPicker/MutableStringPicker';
import { FaPlay } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { GrDocumentTest } from "react-icons/gr";
import { IoMdAdd, IoIosRemove } from "react-icons/io";

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
      let regExp = null;
      if (modifiedCell.value === value) return;
      if (props.cell.reference){
        const immutablePhrases = props.cell.reference.split(props.cell.mutableString);
        regExp = createValidationRegex(immutablePhrases);
      }
      if (props.cell.reference === undefined || props.cell.reference.length === 0 || regExp.exec(value) === null){
        const oldValue = props.cell.value;
        let oldCursorPosition = editorRef.current.getPosition();
        oldCursorPosition.column -= (value.length - oldValue.length);
        editorRef.current?.getModel().setValue(oldValue);
        editorRef.current?.setPosition(oldCursorPosition);
        return;
      }

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

    const updateMutableStringHandler = useCallback((value) => {
      let modifiedCell = props.cell;
      if (modifiedCell.mutableString === value) return;
      modifiedCell.mutableString = value;
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
      <div data-cy="immutable-code-cell" ref={containerRef} 
      className={'code-cell-container'}
      >
        <p style={{color: "var(--code-color)"}}>Możesz modyfikować tylko część kodu oznaczoną tekstem "{props.cell.mutableString}". Pozostałe zmiany w kodzie zostaną cofnięte</p>
        {props.userType === UserType.teacher ?
        // TEACHER VERSION
        <React.Fragment>
        <MonacoEditor ref={{containerRef: containerRef, editorRef: editorRef}} updateEditorValueHandler={updateEditorValueHandler} text={props.text}/>  
        <div className='editor-button-container'>
         <button title="Uruchom" data-cy="code-run-button" onClick={compile} className='editor-button' disabled={isExecuting}>{!isExecuting ? <FaPlay color='white'/> : <HiOutlineDotsHorizontal color="white" />}</button>
         {props.cell.test === undefined ? <button title="Dodaj testy" data-cy="add-tests-button" onClick={() => {addEditor("test")}} className='editor-button' variant="success"><IoMdAdd color="white" /><GrDocumentTest className='grIcon' /></button> : null}
        </div>  
        {isConnectionError ? <div style={{color: 'red'}}>There was some error connecting to the compiler. Please check if all app components are running</div> : null}
        {props.cell.output && <div><OutputCell titleValue="Rezultat wykonania" clearOutputHandler={clearCodeOutput} output={props.cell.output}></OutputCell></div>}
        {props.cell.outputTest && <div> <OutputCell titleValue="Rezultat testów" clearOutputHandler={clearTestOutput} output={props.cell.outputTest}></OutputCell></div>}
        {props.cell.test !== undefined ? 
        // TEST EDITOR
        <div className={"code-cell-container"}> 
          <div className='editor-caption'>Testy</div>
          <MonacoEditor ref={{containerRef: containerRef, editorRef: testEditorRef}} updateEditorValueHandler={updateTestEditorValueHandler} text={props.cell.test}></MonacoEditor>
          <div className='editor-button-container'>
          <button title="Usuń testy" data-cy="remove-tests-button" onClick={() => {removeEditor("test")}} className='editor-button' variant="danger"><IoIosRemove color="white" /><GrDocumentTest className='grIcon' /></button>
          </div>  
        </div>: null}
        
        {// REFERENCE EDITOR
        props.cell.reference !== undefined ? 
        <div className={"code-cell-container"}> 
          <div className='editor-caption'>Kod ze wzorcem początkowym - tu zdefiniuj, gdzie student powinien mieć możliwość edycji kodu</div>
          <MonacoEditor ref={{containerRef: containerRef, editorRef: referenceEditorRef}} updateEditorValueHandler={updateReferenceEditorValueHandler} text={props.cell.reference}></MonacoEditor>
        </div>: null}
        <MutableStringPicker initialMutableString={props.cell.mutableString} updateMutableStringHandler={updateMutableStringHandler}></MutableStringPicker>
        </React.Fragment> 
        : 
        // STUDENT VERSION
        <React.Fragment>
        <MonacoEditor ref={{containerRef: containerRef, editorRef: editorRef}} updateEditorValueHandler={updateEditorValueHandler} text={props.text}></MonacoEditor>
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

export default ImmutableCodeCell