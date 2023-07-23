import React, { useState, useEffect, memo } from 'react'; 
import Editor from '@monaco-editor/react';

const MonacoEditor = memo(function MonacoEditor({updateEditorValueHandler, 
  editorRef,
  containerRef,
  text}) {
    const [monaco, setMonaco] = useState(null);
    const [editorValue, setEditorValue] = useState(text);

    const handleEditorDidMount = (editor, monaco) => {
        setMonaco(monaco);
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
        if (editorRef.current !== null) editorRef.current.layout({ width: containerRef.current.clientWidth, height: editorRef.current.getContentHeight() });
      }
    
    useEffect(() => {
      if (text !== null){
        if (text.length !== 0 && text === editorValue) return;
        if (editorRef.current !== null && editorRef.current?.getModel() !== null) editorRef.current?.getModel().setValue(text);  
      }
          }, [text, editorRef.current]);
    
    useEffect(() => {
      if (editorRef.current !== null) editorRef.current.layout({ width: containerRef.current.clientWidth, height: editorRef.current.getContentHeight() });
    }, [editorRef.current, containerRef]);

    useEffect(() => {
      const timeOutId = setTimeout(() => {updateEditorValueHandler(editorValue)}, 650);
      return () => clearTimeout(timeOutId);
    }, [editorValue, updateEditorValueHandler])

    
    const editorChangeHandler = (event) => {
      setEditorValue(event);
      editorRef.current.layout({ width: containerRef.current.clientWidth, height: editorRef.current.getContentHeight() })
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
        defaultValue={text} 
        // value={editorValue}
        onChange={editorChangeHandler}/>
    )
})

export default MonacoEditor