import React, { useState, useEffect, memo, forwardRef, useRef } from 'react'; 
import Editor from '@monaco-editor/react';

const MonacoEditor = memo(forwardRef(function MonacoEditor(props, ref) {
    const {editorRef, containerRef} = ref;
    const {updateEditorValueHandler, text} = props;
    const [monaco, setMonaco] = useState(null);
    const [editorValue, setEditorValue] = useState(text);
    const prevEditorValue = useRef(text);

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
      prevEditorValue.current = editorValue;
    }, [editorValue])

    useEffect(() => {
      const syncEditorValues = () => {
        if (text !== null){
          if (text.length !== 0 && text === prevEditorValue.current) return;
          if (editorRef.current !== null && editorRef.current?.getModel() !== null) editorRef.current?.getModel().setValue(text);  
        }
      }

      syncEditorValues();
    }, [text, editorRef]);

    useEffect(() => {
      const updateEditorSize = () => {
        if (editorRef.current !== null) editorRef.current.layout({ width: containerRef.current.clientWidth, height: editorRef.current.getContentHeight() });
      }

      updateEditorSize();
    })

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
            fontSize: "16px",
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
}))

export default MonacoEditor