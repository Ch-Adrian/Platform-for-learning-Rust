import React, { useRef } from 'react'
import Editor from '@monaco-editor/react';
import Button from 'react-bootstrap/Button';
import "./CodeCell.css"
import CodeExecutorService from '../../../services/CodeExecutorService';


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

  function compile() {
  CodeExecutorService.compileAndRun(editorRef.current.getValue())
    .then((res) => {
      editorRef.current.setValue(res.data)
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
        fontSize: 14,
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
    </div>
  )
}

export default CodeCell