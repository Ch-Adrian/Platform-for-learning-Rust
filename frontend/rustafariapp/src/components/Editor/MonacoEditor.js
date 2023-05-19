import React, { useRef, useState, useEffect } from 'react'; 
import Editor from '@monaco-editor/react';

const MonacoEditor = (props) => {
    const [monaco, setMonaco] = useState(null);

    const handleEditorDidMount = (editor, monaco) => {
        setMonaco(monaco);
        props.editorRef.current = editor;
        monaco.editor.defineTheme('rustafariapp', {
          base: 'vs-dark',
          inherit: true,
          rules: [],
          colors: {
            'editor.background': '#262335',
          },
        });
        monaco.editor.setTheme('rustafariapp');
        if (props.editorRef.current !== null) props.editorRef.current.layout({ width: props.containerRef.current.clientWidth, height: props.editorRef.current.getContentHeight() });
      }
    
      useEffect(() => {
        if (props.editorRef.current !== null) props.editorRef.current.getModel().setValue(props.text);
      }, [props.text, props.editorRef]);
    
      
      useEffect(() => {
        if (props.editorRef.current !== null) props.editorRef.current.layout({ width: props.containerRef.current.clientWidth, height: props.editorRef.current.getContentHeight() });
      }, [props.editorRef.current, props.containerRef]);
    
      const editorChangeHandler = () => {
        props.editorRef.current.layout({ width: props.containerRef.current.clientWidth, height: props.editorRef.current.getContentHeight() })
      }

    return (
        <Editor 
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
        onChange={editorChangeHandler}/>
    )
}

export default MonacoEditor