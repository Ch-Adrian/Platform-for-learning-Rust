import React, { useRef } from 'react'
import Editor from '@monaco-editor/react';
import Button from 'react-bootstrap/Button';
import "./CodeCell.css"
import axios from 'axios'

const RUST_COMPILER_REST_API_URL = "http://localhost:8080/lesson/code"

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

  const showValue = () => {
    console.log(editorRef.current.getValue());
  }

  function compile() {
    axios
    .post(RUST_COMPILER_REST_API_URL, {
      item: editorRef.current.getValue()
    }
    
    )
  .then((response) => editorRef.current.setValue(response.data))
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