import React, { useRef, useContext, useState } from 'react';
import Editor from '@monaco-editor/react';
import Button from 'react-bootstrap/Button';
import "./CodeCell.css"
import CodeExecutorService from '../../../services/CodeExecutorService';
import OutputCell from '../OutputCell/OutputCell';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';


const CodeCell = (props) => {
  const editorRef = useRef(null);
  const {updateCell} = useContext(LessonContext);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isConnectionError, setIsConnectionError] = useState(false);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.defineTheme('rustafariapp', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#262335',
      },
    });
    monaco.editor.setTheme('rustafariapp');
  }

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


  return (
    <div>
      <Editor 
       options={{
        minimap: {
          enabled: false,
        },
        fontSize: 18,
        wordWrap: "on",
        lineNumbers: "off",
      }}
       height="20vh" 
       width="100%"
       defaultLanguage="rust" 
       onMount={handleEditorDidMount} 
       defaultValue={props.text} />

      <div className='editor-button-container'>
       <Button onClick={compile} className='editor-button' variant="success" disabled={isExecuting}>{!isExecuting ? 'Run code' : 'Running...'}</Button>{' '}
      </div>  
      {isConnectionError ? <div style={{color: 'red'}}>There was some error connecting to the compiler. Please check if all app components are running</div> : null}
      {props.cell.outputTest && <div> Test Output <OutputCell output={props.cell.outputTest}></OutputCell></div>}
      {props.cell.output && <div> Code output <OutputCell output={props.cell.output}></OutputCell></div>}
    </div>
  )
}

export default CodeCell