import React, { useRef, useContext, useState, useCallback, memo } from 'react';
import Button from 'react-bootstrap/Button';
import "./CodeCell.css"
import CodeExecutorService from '../../../services/CodeExecutorService';
import OutputCell from '../OutputCell/OutputCell';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import MonacoEditor from '../../Editor/MonacoEditor';


const CodeCell = memo(function CodeCell(props) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const {updateCell} = useContext(LessonContext);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isConnectionError, setIsConnectionError] = useState(false);

  // const handleEditorDidMount = (editor, monaco) => {
  //   setMonaco(monaco);
  //   editorRef.current = editor;
  //   monaco.editor.defineTheme('rustafariapp', {
  //     base: 'vs-dark',
  //     inherit: true,
  //     rules: [],
  //     colors: {
  //       'editor.background': '#262335',
  //     },
  //   });
  //   monaco.editor.setTheme('rustafariapp');
  //   if (editorRef.current !== null) editorRef.current.layout({ width: containerRef.current.clientWidth, height: editorRef.current.getContentHeight() });
  // }

  // useEffect(() => {
  //   if (editorRef.current !== null) editorRef.current.getModel().setValue(props.text);
  // }, [props.text]);

  
  // useEffect(() => {
  //   if (editorRef.current !== null) editorRef.current.layout({ width: containerRef.current.clientWidth, height: editorRef.current.getContentHeight() });
  // }, [editorRef.current]);

  // const editorChangeHandler = () => {
  //   editorRef.current.layout({ width: containerRef.current.clientWidth, height: editorRef.current.getContentHeight() })
  // }


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

  // console.log(props);

  return (
    <div ref={containerRef}>
      {/* <Editor 
       options={{
        minimap: {
          enabled: false,
        },
        scrollbar: {
          alwaysConsumeMouseWheel: false
        },
        fontSize: 14,
        wordWrap: "on",
        lineNumbers: "off",
        automaticLayout: true,
        scrollBeyondLastLine: false
      }}
       width="100%"
       defaultLanguage="rust" 
       onMount={handleEditorDidMount} 
       defaultValue={props.text} 
       onChange={editorChangeHandler}/> */}
       <MonacoEditor containerRef={containerRef} editorRef={editorRef} updateEditorValueHandler={updateEditorValueHandler} {...props}></MonacoEditor>

      <div className='editor-button-container'>
       <Button onClick={compile} className='editor-button' variant="success" disabled={isExecuting}>{!isExecuting ? 'Run code' : 'Running...'}</Button>{' '}
      </div>  
      {isConnectionError ? <div style={{color: 'red'}}>There was some error connecting to the compiler. Please check if all app components are running</div> : null}
      {props.cell.outputTest && <div> Test Output <OutputCell output={props.cell.outputTest}></OutputCell></div>}
      {props.cell.output && <div> Code output <OutputCell output={props.cell.output}></OutputCell></div>}
    </div>
  )
})

export default CodeCell