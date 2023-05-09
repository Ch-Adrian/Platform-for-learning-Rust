import React, { useRef, useContext } from 'react';
import Editor from '@monaco-editor/react';
import Button from 'react-bootstrap/Button';
import "./CodeCell.css"
import CodeExecutorService from '../../../services/CodeExecutorService';
import OutputCell from '../OutputCell/OutputCell';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';


const CodeCell = (props) => {
  const editorRef = useRef(null);
  const {updateCell} = useContext(LessonContext);

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

  const compile = () => {
    let modifiedCell = props.cell;
    if (props.cell.test){
      CodeExecutorService.compileTestAndRun(editorRef.current.getValue(), props.cell.test)
      .then((res) => {
        modifiedCell.output = res.data;
        modifiedCell.output += "\n";
      })
      .catch((err) => console.log(err));
    } else {
      modifiedCell.output = "";
    }

    CodeExecutorService.compileAndRun(editorRef.current.getValue())
    .then((res) => {
      modifiedCell.output += res.data;
      updateCell(modifiedCell, props.cellIdx, props.currentPage);
    })
    .catch((err) => console.log(err));
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
       <Button onClick={compile} className='editor-button' variant="success">Run code</Button>{' '}
      </div>  

      {props.cell.output && <OutputCell output={props.cell.output}></OutputCell>}
    </div>
  )
}

export default CodeCell