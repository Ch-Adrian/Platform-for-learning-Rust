import React, { useRef } from 'react'
import Editor from '@monaco-editor/react';
import Button from 'react-bootstrap/Button';
import "./CodeCell.css"
import CodeExecutorService from '../../../services/CodeExecutorService';
import OutputCell from '../OutputCell/OutputCell';


const CodeCell = (props) => {
  const editorRef = useRef(null);

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
    let modifiedCell = props.cell;
    if (props.cell.test){
      await CodeExecutorService.compileTestAndRun(editorRef.current.getValue(), props.cell.test)
      .then((res) => {
        modifiedCell.output = res.data;
        modifiedCell.output += "\n";
      })
      .catch((err) => console.log(err));
    } else {
      modifiedCell.output = "";
    }

    await CodeExecutorService.compileAndRun(editorRef.current.getValue())
    .then((res) => {
      modifiedCell.output += res.data;
      props.updateCell(modifiedCell, props.cellIdx);
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
      {props.cell.output && <OutputCell output={props.cell.output}></OutputCell>}
      <div className='editor-button-container'>
       <Button onClick={compile} className='editor-button' variant="success">Run code</Button>{' '}
      </div>  
      
    </div>
  )
}

export default CodeCell